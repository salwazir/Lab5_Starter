# Expand

## 1. Why is it important to put thought into your IDs & Classes when it comes to technology intersections (HTML, CSS, JS)?

IDs and classes are the shared contract between HTML, CSS, and JS — the same string is referenced from a markup attribute, a CSS selector, and a `getElementById` / `querySelector` call in JavaScript. Renaming a class in the HTML silently breaks any selector or DOM query that still uses the old name, and those break-points aren't caught at compile time, only at runtime when the page misbehaves. Because the same identifier is load-bearing across three languages, the cost of a careless name shows up much later than where the mistake was made.

Naming also matters semantically. A class like `red-button` describes the current appearance, so when the design changes to a blue button you either rename it everywhere (touching CSS and JS) or live with a class whose name lies. Naming after purpose (`primary-button`, `submit-action`) keeps the contract stable when only the styling changes. Finally, the structural difference matters: IDs must be unique and feel right for "the one" thing on the page (a single header, a single audio element), while classes describe a kind of thing and can repeat. Picking the wrong one leads to subtle bugs like `getElementsByClassName` returning a list when you expected a single node.

## 2. What are Data attributes? Why might they be useful? How do you access them? What are the implications of using Data attributes when it comes to things like microdata?

Data attributes are author-defined attributes that start with `data-`, like `data-horn-id="party-horn"`. The HTML spec officially permits them, so validators don't complain, and they give you a sanctioned place to attach arbitrary state to an element instead of inventing fake attributes or stuffing data into the class string.

You can read and write them in JavaScript through `element.dataset` (a `DOMStringMap`), where `data-horn-id` becomes `element.dataset.hornId` — the dashed name is auto-converted to camelCase. The slightly more verbose `getAttribute('data-horn-id')` works too. CSS attribute selectors can also key off them, e.g. `[data-state="open"] { ... }`, which is great for representing UI state without juggling extra class names.

The catch with microdata is that data attributes are *not* microdata. Microdata uses `itemscope`, `itemtype`, and `itemprop` and follows a published vocabulary (typically schema.org) that search engines and other consumers actually parse. Throwing semantic information into `data-*` won't help SEO or rich-result snippets — search engines deliberately don't read your custom data attributes. Conflating the two leads to "I added the data, why doesn't Google see it" surprises. If structured semantic meaning is the goal, use microdata or JSON-LD; if you just need a private place to stash UI state, use data attributes.

## 3. What is a DOM fragment? Why are they powerful?

A `DocumentFragment` is a lightweight container node that lives in memory but is not part of the rendered document. You can build up children inside it — append text nodes, elements, even entire subtrees — without any of those operations touching the live DOM. When you finally append the fragment to a real parent, only the fragment's children are inserted; the fragment itself disappears from the tree.

This is powerful for two reasons. The first is performance: every direct mutation of the live DOM can trigger style recalculation, layout, and paint. Inserting 500 list items one-by-one is 500 chances for the browser to do that work. Inserting 500 children into a fragment first and then appending the fragment once collapses it into a single live-DOM mutation. The second is ergonomics — you can construct, pass around, and return a fragment as if it were a single node, even though it logically represents a group. That keeps APIs that build chunks of UI clean, instead of returning arrays of nodes the caller has to loop over.

## 4. What is the point of a "Virtual DOM"? What do you gain? What do you lose?

The Virtual DOM is an in-memory JavaScript representation of what the real DOM should look like. Frameworks like React keep a virtual tree, and on every state change they build a new virtual tree, diff it against the previous one, and apply only the differences to the real DOM in a batched update.

What you gain: a declarative programming model — you describe the UI as a function of state and let the framework figure out which DOM operations are needed, instead of manually tracking and mutating individual nodes. You also get batching: many state changes in one render pass collapse into one efficient set of real-DOM writes, which avoids interleaved reflows. And you get portability — the same component tree can be rendered to DOM, native views, canvas, or strings on a server, because the actual rendering is one swappable layer.

What you lose: there is genuine overhead in maintaining the virtual tree and running the diffing algorithm on every render. For a tiny page or a hot path with very few elements, hand-tuned direct DOM manipulation can beat the virtual-DOM round trip. You also gain a layer of abstraction between you and the real DOM, so debugging weird browser behavior sometimes means stepping through the framework's reconciler before you reach your own code. And you ship a framework runtime to the user, which has a real bundle-size cost.

## 5. In JavaScript, you can usually reference every attribute of an element with a dot selector followed by the attribute name, except for the class attribute, which is `className`. Why is this so?

Because `class` is a reserved word in JavaScript. From very early in the language's history `class` was reserved for future use, and ES6 ultimately gave it real meaning as the keyword for class declarations. If the DOM IDL had exposed an HTML element's class as `element.class`, the parser would have to disambiguate the keyword from the property name in expressions like `element.class = "foo"`. To avoid that ambiguity entirely, the DOM specifies the property as `className` instead. The same workaround happens elsewhere in the platform — `for` (the keyword) becomes `htmlFor` for `<label for=...>`, for example. It is a small leaky abstraction caused by overlap between HTML attribute names and JavaScript reserved words. (Modern code can also use `element.classList`, which sidesteps the awkward string property entirely and gives you `add`, `remove`, `toggle`, and `contains`.)

## 6. What is the difference between using `addEventListener()` and something like `onClick()`? What are the advantages / disadvantages of both?

`addEventListener('click', fn)` registers a listener through the DOM event API. `onclick = fn` (or the inline `onclick="..."` attribute) sets a single property on the element. Functionally that one-property versus list-of-listeners distinction drives every other difference between them.

`addEventListener` lets you register many independent handlers for the same event, and each one runs when the event fires. It accepts an options object so you can opt into capture-phase listening, mark a listener as `passive` (so the browser can scroll without waiting on you), or use `{ once: true }` to auto-detach after the first call. Different parts of the codebase can attach their own listeners without stomping on each other.

`onclick` is simpler — assign a function and you're done — but assigning twice overwrites the first handler, and you can't pick capture phase or set passive. Removing it is just `element.onclick = null`, which is one line, while `removeEventListener` requires you to keep the original function reference around (so an inline arrow function effectively can't be removed later).

In practice `addEventListener` is the right default for anything beyond a quick prototype: it composes, it gives you the modern options, and it doesn't surprise other code that wanted to listen for the same event. `onclick` survives because it is the easiest possible way to wire up a handler when you know nothing else will ever care about that click.
