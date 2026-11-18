import Foundation
import RaycastSwiftMacros
import WebKit

struct PageResult: Codable {
    let text: String
    let author: String?
    let work: String?
}

enum PageStatus: String, Codable {
    case results, empty, pending, access, timeout, network, service
}

struct PageResponse: Codable {
    let status: PageStatus
    var results: [PageResult]? = nil
    var httpStatus: Int? = nil
}

@raycast func readSearchPage(address: String) async -> PageResponse {
    await SearchPage.read(address: address)
}

@MainActor
private final class SearchPage: NSObject, WKNavigationDelegate {
    private static let domain = "www.shenyandayi.com"
    private let view: WKWebView
    private let path: String
    private var failure: PageResponse?

    private init(path: String) {
        self.path = path
        let configuration = WKWebViewConfiguration()
        configuration.websiteDataStore = .nonPersistent()
        view = WKWebView(frame: CGRect(x: 0, y: 0, width: 1200, height: 900), configuration: configuration)
        super.init()
        view.navigationDelegate = self
    }

    static func read(address: String) async -> PageResponse {
        guard let url = URL(string: address),
              ["/wantWordsResult", "/wantQuotesResult"].contains(url.path),
              accepts(url, path: url.path) else {
            return PageResponse(status: .service)
        }
        let page = SearchPage(path: url.path)
        return await page.load(url)
    }

    private static func accepts(_ url: URL, path: String) -> Bool {
        url.scheme == "https" && url.host == domain && url.path == path
            && url.port == nil && url.user == nil && url.password == nil
    }

    private func load(_ url: URL) async -> PageResponse {
        view.load(URLRequest(url: url))
        defer { view.stopLoading() }
        let deadline = Date().addingTimeInterval(15)
        while Date() < deadline {
            if let failure { return failure }
            if let url = view.url, Self.accepts(url, path: path),
               let encoded = try? await view.evaluateJavaScript(Self.readResults, in: nil, contentWorld: .defaultClient) as? String,
               let response = try? JSONDecoder().decode(PageResponse.self, from: Data(encoded.utf8)),
               response.status != .pending {
                return response
            }
            try? await Task.sleep(for: .milliseconds(250))
            if Task.isCancelled { return PageResponse(status: .timeout) }
        }
        return PageResponse(status: .timeout)
    }

    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction) async -> WKNavigationActionPolicy {
        guard navigationAction.targetFrame?.isMainFrame != false else { return .allow }
        guard let url = navigationAction.request.url, Self.accepts(url, path: path) else {
            failure = PageResponse(status: .access)
            return .cancel
        }
        return .allow
    }

    func webView(_ webView: WKWebView, decidePolicyFor navigationResponse: WKNavigationResponse) async -> WKNavigationResponsePolicy {
        guard navigationResponse.isForMainFrame,
              let response = navigationResponse.response as? HTTPURLResponse,
              response.statusCode >= 400 else { return .allow }
        let status: PageStatus = [401, 403, 429].contains(response.statusCode) ? .access : .service
        failure = PageResponse(status: status, httpStatus: response.statusCode)
        return .cancel
    }

    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        failure = failure ?? PageResponse(status: .network)
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        failure = failure ?? PageResponse(status: .network)
    }

    private static let readResults = #"""
    (() => {
      const quotes = location.pathname === '/wantQuotesResult';
      const selector = quotes ? '.quote-item' : '.wantword-card-content .word-item .item-value';
      const rows = [...document.querySelectorAll(selector)].filter(row => row.getClientRects().length);
      if (quotes) {
        const rank = row => parseInt(row.querySelector('.quote-index')?.textContent, 10) || Infinity;
        rows.sort((left, right) => rank(left) - rank(right));
      }
      const results = [];
      const seen = new Set();
      for (const row of rows) {
        const detail = quotes ? row.querySelector('.quote-item-detail') : row;
        if (!detail) continue;
        const author = detail.querySelector('.quote-author')?.textContent.trim();
        const work = detail.querySelector('.quote-work')?.textContent.trim();
        const copy = detail.cloneNode(true);
        copy.querySelectorAll('.quote-source, .quote-explanation').forEach(node => node.remove());
        const text = (quotes ? copy.textContent : detail.innerText).trim();
        const key = JSON.stringify([text, author, work]);
        if (text && !seen.has(key)) {
          seen.add(key);
          results.push({ text, author, work });
        }
        if (results.length === 80) break;
      }
      if (results.length) return JSON.stringify({ status: 'results', results });
      const pageText = document.body?.innerText ?? '';
      if (pageText.includes('该账号存在异常')) return JSON.stringify({ status: 'access' });
      if (document.querySelector('.ant-spin-spinning')) return JSON.stringify({ status: 'pending' });
      if (pageText.includes('糟糕，发生了一些小错误') || pageText.includes('糟糕，出现了一点小问题')) {
        return JSON.stringify({ status: 'service' });
      }
      if (pageText.includes('没有找到内容哦')) return JSON.stringify({ status: 'empty' });
      return JSON.stringify({ status: 'pending' });
    })()
    """#
}
