// SP-B1 test site: a tiny local shop with a sign-in step. Fake data only; binds to 127.0.0.1.
import http from "node:http";

const items = [
  { id: 1, name: "Desk lamp", price: 24 },
  { id: 2, name: "Notebook", price: 6 },
  { id: 3, name: "Mug", price: 9 },
];
const page = (title, body) => `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title></head><body><h1>${title}</h1>${body}</body></html>`;

export function start(port = 4173) {
  const cart = new Map();
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const send = (html) => { res.writeHead(200, { "content-type": "text/html" }); res.end(html); };
    if (url.pathname === "/") {
      const q = (url.searchParams.get("q") ?? "").toLowerCase();
      const list = items.filter((i) => i.name.toLowerCase().includes(q)).map((i) => `<li><a href="/item/${i.id}">${i.name}</a> $${i.price}</li>`).join("");
      return send(page("Spike Shop", `<form action="/"><label>Search <input name="q" value="${q}"></label><button>Search</button></form><ul>${list}</ul><a href="/cart">Cart (${[...cart.values()].reduce((a, b) => a + b, 0)})</a>`));
    }
    const m = url.pathname.match(/^\/item\/(\d+)$/);
    if (m) {
      const it = items.find((i) => i.id === Number(m[1]));
      return send(page(it.name, `<p>$${it.price}</p><form action="/add" method="get"><input type="hidden" name="id" value="${it.id}"><label>Quantity <input name="qty" type="number" value="1" min="1"></label><button>Add to cart</button></form>`));
    }
    if (url.pathname === "/add") {
      const id = Number(url.searchParams.get("id"));
      cart.set(id, (cart.get(id) ?? 0) + Number(url.searchParams.get("qty") ?? 1));
      res.writeHead(302, { location: "/cart" }); return res.end();
    }
    if (url.pathname === "/cart") {
      const rows = [...cart].map(([id, n]) => `<li>${items.find((i) => i.id === id).name} × ${n}</li>`).join("") || "<li>Empty</li>";
      return send(page("Cart", `<ul>${rows}</ul><a href="/signin">Checkout</a>`));
    }
    if (url.pathname === "/signin") {
      return send(page("Sign in to Spike Shop", `<form action="/checkout"><label>Email <input name="email" type="email"></label><label>Password <input name="password" type="password"></label><button>Sign in</button></form><p><a href="/checkout?guest=1">I'm signed in, continue</a></p>`));
    }
    if (url.pathname === "/checkout") {
      return send(page("Checkout", `<form action="/done"><label>Name <input name="name"></label><label>City <input name="city"></label><button>Place test order</button></form>`));
    }
    if (url.pathname === "/done") {
      const total = [...cart].reduce((s, [id, n]) => s + items.find((i) => i.id === id).price * n, 0);
      return send(page("Order placed", `<p id="confirm">Test order for ${url.searchParams.get("name")} in ${url.searchParams.get("city")}, total $${total}.</p>`));
    }
    res.writeHead(404); res.end("not found");
  });
  return new Promise((r) => server.listen(port, "127.0.0.1", () => r(server)));
}
