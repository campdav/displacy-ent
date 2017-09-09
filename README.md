
# Langkah : style visualizer for french writers

the objective of this application is to help french writers in their writings, by visualizing some tricky mistakes.
 - "repetitions" : Langkah display adjectives, nouns or verbs, with the same lemma, if they are too close in the text.
 - "weak terms" : verbs like "faire", "avoir" and "être" can be considered as weaks. (have to be used with care)
 - "passive verbs"
 - "sentences without verbs"

Langkah is a fork from [displacy-ent](https://github.com/explosion/displacy-ent).

## Run the demo

As a fork from displaCy-ent, this app is implemented in [Jade (aka Pug)](https://www.jade-lang.org), an extensible templating language that compiles to HTML, and is built or served by [Harp](https://harpjs.com). To serve it locally on [http://localhost:9000](http://localhost:9000), simply run:

```bash
sudo npm install --global harp
git clone https://github.com/campdav/langkah-front
cd langkah-front
harp server
```

The app is written in ECMAScript 6. For full, cross-browser compatibility, make sure to use a compiler like [Babel](https://github.com/babel/babel). For more info, see this [compatibility table](https://kangax.github.io/compat-table/es6/).

## Using langkah-ent.js

To use Langkah in your project, include [`langkah-ent.js`](assets/js/langkah-ent.js) from GitHub or via npm:

```bash
npm install langkah-ent
```

Then initialize a new instance specifying the API and settings:

```javascript
const langkah = new LangkahENT('http://localhost:8001', {
    container: '#langkah',
    defaultText: 'La souris est mangée par le chat. Les chats sont gourmands.',
    defaultEnts: ['repetition']
});
```

The service that produces the input data is open source, too. You can find it at  [langkah-services](https://github.com/campdav/langkah-services).

**langkah-services** is a fork from [spacy-services](https://github.com/explosion/spacy-services).

The following settings are available:

| Setting | Description | Default |
| --- | --- | --- |
| **container** | element to display text in, can be any query selector | `#langkah` |
| **defaultText** | text used if Langkah ENT is run without text specified | `'When Sebastian Thrun started working on self-driving cars at Google in 2007, few people outside of the company took him seriously.'` |
| **defaultModel** | model used if Langkah ENT is run without model specified | `'en'` |
| **defaultEnts** | array of entities highlighted in text | `['person', 'org', 'gpe', 'loc', 'product']` |
| **onStart** | function to be executed on start of server request | `false` |
| **onSuccess** | callback function to be executed on successful server response | `false` |
| **onRender** | callback function to be executed when visualisation has rendered | `false` |
| **onError** | function to be executed if request fails | `false` |

## Visualising syle

The `annotator(text, model, ents)` method renders a text for a given set of entities in the container.

```javascript
const text = 'La souris est mangée par le chat.';
const model = 'fr';
const ents = ['repetition', 'passive'];

langkah.parse(text, model, ents);
```

## Rendering Entities Manually

Alternatively, you can use `render()` to manually render a text and its entity spans for a given set of entities:

```javascript
const text = 'La souris est mangée par le chat.';
const spans = [ { end: 20, start: 10, type: "passive" }];
const ents = ['passive'];

langkah.render(text, spans, ents);
```
## How it works

Langkah uses only the `<mark>` element with data attributes and custom CSS styling. No additional, visible content or markup is added to your input text and no JavaScript is required to display the entities.

Here's an example of the markup:

```html
<div class="entities">
    La souris <mark data-entity="passive">est mangée</mark>.
</div>
```

And here is the CSS it needs to display the entity labels:

```css
.entities {
    line-height: 2;
}

[data-entity] {
    padding: 0.25em 0.35em;
     margin: 0px 0.25em;
     line-height: 1;
     display: inline-block;
     border-radius: 0.25em;
     border: 1px solid;
}

[data-entity]::after {
    box-sizing: border-box;
    content: attr(data-entity);
    font-size: 0.6em;
    line-height: 1;
    padding: 0.35em;
    border-radius: 0.35em;
    text-transform: uppercase;
    display: inline-block;
    vertical-align: middle;
    margin: 0px 0px 0.1rem 0.5rem;
}

[data-entity][data-entity="passive"] {
    background: rgba(166, 226, 45, 0.2);
    border-color: rgb(166, 226, 45);
}
```

Entity labels are taken from the `data-entity` attribute and are rendered after the span as a CSS pseudo element.
