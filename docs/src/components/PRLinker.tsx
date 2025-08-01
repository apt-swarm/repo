import { useState } from "preact/hooks";

interface PRTemplate {
  name: string;
  filename: string;
}

const PR_TEMPLATES: PRTemplate[] = [
  { name: "New Package", filename: "new_package.md" },
];

export default function PRLinker() {
  const [username, setUsername] = useState("");
  const [repository, setRepository] = useState("apt-swarm");
  const [branch, setBranch] = useState("");

  const mainBranch = "main";

  const generateDiffUrl = (template?: PRTemplate): string => {
    if (!username || !repository || !branch) {
      return "#";
    }

    const headBranchPart =
      username !== "neuroverse-fm" ? `${username}:${repository}:` : "";

    const baseUrl = `https://github.com/neuroverse-fm/apt-swarm/compare/${mainBranch}...${headBranchPart}${branch}`;

    if (template) {
      return `${baseUrl}?template=${template.filename}`;
    }

    return baseUrl;
  };

  const openDiff = (template?: PRTemplate) => {
    const url = generateDiffUrl(template);
    if (url !== "#") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const isFormValid = username.trim() && repository.trim() && branch.trim();

  return (
    <div
      className="pr-linker"
      style={{
        maxWidth: "600px",
        margin: "2rem auto",
        padding: "1.5rem",
        border: "1px solid var(--sl-color-gray-5)",
        borderRadius: "8px",
        background: "var(--sl-color-gray-6)",
      }}
    >
      <div className="pr-linker__form">
        <h3 style={{ marginTop: 0, marginBottom: "1.5rem" }}>
          Generate GitHub Diff Link
        </h3>

        <div class="div-box">
          <label
            htmlFor="username"
            class="text-label"
          >
            GitHub Username:
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onInput={(e) => setUsername((e.target as HTMLInputElement).value)}
            placeholder="e.g., neuroverse-fm"
            class="text-box"
          />
        </div>

        <div class="div-box">
          <label
            htmlFor="repository"
            class="text-label"
          >
            Repository Name:
          </label>
          <input
            id="repository"
            type="text"
            value={repository}
            onInput={(e) => setRepository((e.target as HTMLInputElement).value)}
            placeholder="e.g., apt-swarm"
            class="text-box"
          />
        </div>

        <div class="div-box">
          <label
            htmlFor="branch"
            class="text-label"
          >
            Branch Name:
          </label>
          <input
            id="branch"
            type="text"
            value={branch}
            onInput={(e) => setBranch((e.target as HTMLInputElement).value)}
            placeholder="e.g., feature/new-feature"
            class="text-box"
          />
        </div>

        <div
          style={{
            marginTop: "1rem",
            padding: "0.75rem",
            background: "var(--sl-color-white)",
            borderRadius: "6px",
            border: "1px solid var(--sl-color-gray-4)",
          }}
        >
          <small style={{ color: "black" }}>
            Diff:{" "}
            <code
              class="diff-box"
            >
              {(username !== "neuroverse-fm"
                ? (username || "your-name") + ":"
                : "") + (branch || "your-branch")}
            </code>{" "}
            →{" "}
            <code
              class="diff-box"
            >
              {username === "neuroverse-fm"
                ? mainBranch
                : `neuroverse-fm:${mainBranch}`}
            </code>
          </small>
        </div>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h4 class="div-box">Open Diff with Template:</h4>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          <button
            onClick={() => openDiff()}
            disabled={!isFormValid}
            class="diff-template-buttons"
            style={{
              background: isFormValid
                ? "var(--sl-color-blue)"
                : "var(--sl-color-gray-4)",
              color: isFormValid ? "white" : "var(--sl-color-gray-2)",
              cursor: isFormValid ? "pointer" : "not-allowed",
            }}
          >
            Open Basic Diff
          </button>

          {PR_TEMPLATES.map((template) => (
            <button
              key={template.filename}
              onClick={() => openDiff(template)}
              disabled={!isFormValid}
              class="diff-template-buttons"
              style={{
                background: isFormValid
                  ? "var(--sl-color-blue)"
                  : "var(--sl-color-gray-4)",
                color: isFormValid ? "white" : "var(--sl-color-gray-2)",
                cursor: isFormValid ? "pointer" : "not-allowed",

              }}
            >
              {template.name} Template
            </button>
          ))}
        </div>

        {!isFormValid && (
          <p
            style={{
              color: "var(--sl-color-red)",
              fontSize: "14px",
              margin: 0,
            }}
          >
            Please fill in all fields to generate diff links.
          </p>
        )}
      </div>
    </div>
  );
}
