# Learning-Digital-Technology
An interactive study website for **JSS 1 Digital Technology (First Term, 2025/2026)**. It turns the First Term note and examination into weekly lessons, a practice quiz, a glossary and a progress tracker. It is a static site, so there is nothing to install and no build step.

## Features

- **8 weekly lessons** covering Weeks 1, 2, 3, 4, 6, 8, 9 and 10, with the full note text, tables and 71 pictures.
- **Scheme of work** for the term, available as a collapsible table on the Lessons page.
- **Exam practice quiz** with 102 multiple-choice questions and three modes:
  - Quick quiz: 10 random questions
  - Practice set: 25 random questions
  - Full exam: every question, in order
- **Instant feedback** after each answer, plus a list of missed questions with the correct answers at the end.
- **Glossary** of key terms with live search.
- **Progress tracking** (lessons explored and best quiz score) saved in the visitor's browser, with a reset button.
- **Responsive and accessible:** works on phones and desktops, supports keyboard navigation, and respects reduced-motion settings.

## Topics covered

| Week | Lesson |
|------|--------|
| 1 | Introduction to Digital Technology |
| 2 | Historical Development of Digital Devices |
| 3 | Career Opportunities in Information Technology |
| 4 | Basic Computer Hardware Components I |
| 6 | Basic Computer Hardware Components II: Storage Units |
| 8 | Basic Software Concepts |
| 9 | Computer Booting and Shutdown Processes |
| 10 | MS Word (Introduction) |

## Project structure

```
.
├── index.html      # Page layout and sections
├── style.css       # All styling
├── script.js       # Navigation, lessons, quiz, glossary, progress
├── content.js      # Lesson text (HTML) and the scheme of work
├── questions.js    # Quiz questions
├── assets/img/     # Lesson pictures (compressed .webp)
├── .nojekyll       # Tells GitHub Pages to serve files as they are
└── README.md
```

Keep `assets/` next to `index.html`, or the lesson pictures will not load.

## Run locally

Open `index.html` in any modern browser. To serve it from a local web server instead:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Publish with GitHub Pages

1. Upload every file and folder above to the root of a GitHub repository, with `index.html` at the top level.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then click **Save**.
4. After a minute or two, the site is live at `https://<username>.github.io/<repository-name>/`.

## Customising the content

**Add or edit quiz questions** in `questions.js`. Each question has the question text, four options, and the index of the correct option (0 is A, 1 is B, 2 is C, 3 is D):

```js
{ "q": "RAM stands for _____", "a": ["Read Access Memory", "Random Access Memory", "Rapid Active Memory", "Run Application Memory"], "c": 1 }
```

The question counts on the site update automatically.

**Edit a lesson** by changing its HTML in `content.js`. The entries in `window.LESSON_HTML` follow the same order as the `lessons` list in `script.js`.

**Add a lesson** by adding an entry to the `lessons` list in `script.js` (week, icon, title, description) and a matching HTML string at the same position in `content.js`. Progress totals update on their own.

**Add glossary terms** by adding `["Term", "Meaning"]` pairs to the `terms` list in `script.js`.

**Reset saved progress** with the button on the "My progress" page. Progress is stored in the browser's `localStorage` under the key `lwt-progress-v1`.

## Technology

Plain HTML, CSS and JavaScript. There are no frameworks, build tools or external dependencies, and the site works offline once loaded.

## Notes

- The lessons and questions are based on the JSS 1 First Term Digital Technology note and examination papers supplied by the teacher.
- A few typos in the source documents were corrected, and repeated quiz questions were removed.
