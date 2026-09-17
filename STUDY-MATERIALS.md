# PX Study Materials

The Study Materials platform is intentionally data-driven. The UI lives in `study-materials.html`, styling in `study-materials.css`, behavior in `study-materials.js`, and academic content in `study-materials-data.js`.

## Content hierarchy

```text
Year
└── Branch
    └── Semester
        └── Subject
            └── Unit
                └── Topic
                    ├── notes.definition
                    ├── notes.explanation[]
                    ├── notes.formula
                    ├── notes.example
                    ├── notes.important[]
                    ├── notes.mistakes[]
                    ├── notes.short[]
                    ├── notes.long[]
                    └── notes.mcq[][]
```

## Adding another branch

Add another object to `years[0].branches`. Give it a unique `id`, display `title`, official `code`, and its `semesters` array. The same UI will automatically render the branch cards, subjects, units, topics and search results.

## Adding a subject

A subject needs `id`, `code`, `title`, `category`, and `units`. Each unit needs `id`, `title`, and `topics`. A topic can be a simple string while building the syllabus map, or an object when detailed notes are ready.

## Detailed topic object

```js
{
  id:'topic-id',
  title:'Topic name',
  type:'concept',
  keywords:'search words',
  diagram:'generic',
  notes:{
    definition:'...',
    explanation:['...','...'],
    formula:'...',
    example:'...',
    important:['...'],
    mistakes:['...'],
    short:['...'],
    long:['...'],
    mcq:[['Question','Option A','Option B','Option C','Option D']]
  }
}
```

## Current demo source

The first-year CSE demo follows the SBTE Bihar 2024–25 CSE curriculum structure. The official curriculum page is the reference point for future syllabus refreshes. Content should be updated in the data file instead of rebuilding page HTML.

## PDF workflow

`Download PDF` opens the browser's print-to-PDF workflow. Print CSS removes navigation and keeps a compact PrinceXmahto Study Materials brand mark on the printed pages. This keeps the PDF generation client-side and requires no server or secret key.

## Student state

Completion and bookmarks are stored in browser `localStorage` under `px-study-state-v1`. This is deliberately client-side for the demo. A future authenticated version can replace that adapter with Supabase without changing the content hierarchy.
