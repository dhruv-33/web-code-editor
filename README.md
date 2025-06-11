# 🖥️ VS Code – style web code editor

This is a web-based code editor inspired by Visual Studio Code, built using Next.js, Tailwind CSS, and Monaco Editor. It replicates core IDE-like features - such as file navigation, multi-tab editing, syntax highlighting, and JavaScript execution - entirely within the browser. This project is ideal for learning, rapid prototyping, or showcasing coding environments without any backend dependencies.

## 🧱 Tech Stack
- Next.js – React Framework
- Tailwind CSS – Utility-first styling
- @monaco-editor/react – Code editor
- Local state – State management
- localStorage – Data persistence

---

## ✅ Features
1. Project Explorer : Create, rename, delete, and organize files/folders with drag-and-drop and nested support. Changes persist via localStorage.
2. Tabbed Editor : Open multiple files in tabs, reorder or close them, and track unsaved changes.
3. Monaco Editor : Integrated with syntax highlighting for JavaScript, HTML, and CSS. Auto-saves content to localStorage.
4. JavaScript Execution : Run '.js' files safely in a sandboxed iframe and view output in a terminal-like panel.
5. Resizable Layout : Adjustable sidebar-editor and editor-terminal panes for a flexible workspace.
6. Theme Toggle : Switch between Light and Dark themes, with system preference detection.
7. Search : Quickly filter and highlight files/folders by name.

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/dhruv-33/web-code-editor.git
cd web-code-editor
```
### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Start the Development Server

```bash
npm run dev
# or
yarn dev
```

- Then visit: http://localhost:3000 in your browser.

---

## 🖼️ Screenshots

### 1. Main UI
- Main UI :
![Main UI](public/Images/Main_UI.png)

### 2. File & Folder Operations
- Add Folder : ![Folder](public/Images/Folder.png)
- Add File : ![File](public/Images/File.png)
- Rename : ![Rename](public/Images/Rename.png)
- Same Name Error : ![Same name](public/Images/Same_name.png)
- After Rename : ![After rename](public/Images/After_rename.png)
- Drag : ![Drag](public/Images/Drag.png)
- After Drag : ![After Drag](public/Images/After_Drag.png)
- Delete : ![Delete](public/Images/Delete.png)
- Save FileTree in LocalStorage : ![Save FileTree](public/Images/Save_FileTree.png)

### 3. Editor Features
- Monaco Editor : ![Monaco Editor 1](public/Images/Monaco_Editor_1.png) ![Monaco Editor 2](public/Images/Monaco_Editor_2.png)
- Tabs Open : ![Tabs Open](public/Images/Tabs_Open.png)
- Auto Save : ![Auto Save](public/Images/Auto_Save.png)
- Highlight HTML : ![Highlight html](public/Images/Highlight_html.png)
- Highlight CSS : ![Highlight css](public/Images/Highlight_css.png)
- Highlight JavaScript : ![Highlight js](public/Images/Highlight_js.png)
- Save Content in Localstorage : ![Save Content](public/Images/Save_Content.png)

### 4. Terminal & Run
- Terminal : ![Terminal](public/Images/Terminal.png)
- Run HTML : ![Run html](public/Images/Run_html.png)
- Run JS : ![Run js](public/Images/Run_js.png)

### 5. Resizing Pannel
- Resizable Panel : ![Resizable Pannel](public/Images/Resizable_Pannel.png)

### 6. Theme
- Theme : ![Theme](public/Images/Theme.png)
- Theme System : ![Theme System](public/Images/Theme_System.png)
- Theme Dark : ![Theme Dark](public/Images/Theme_Dark.png)
- Theme Light : ![Theme Light](public/Images/Theme_Light.png)

### 7. Search
- Search : ![Search 1](public/Images/Search_1.png) ![Search 2](public/Images/Search_2.png)

## 🙌 Contributions
- Feel free to fork the repo, raise issues, and submit pull requests.

## 📜 License
- This project is open-source and available under the MIT License.

🚀 Happy Coding! 🎉