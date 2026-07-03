from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import sys


class PortfolioRequestHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.split("?", 1)[0] in {"/editor.html", "/editor"}:
            self.send_error(HTTPStatus.NOT_FOUND, "Editor is local-only")
            return

        super().do_GET()


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 4173
    server = ThreadingHTTPServer(("", port), PortfolioRequestHandler)
    print(f"Serving public site at http://localhost:{port}")
    server.serve_forever()


if __name__ == "__main__":
    main()
