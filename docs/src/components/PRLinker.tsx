import { useState } from "preact/hooks";

interface PRTemplate {
  name: string;
  filename: string;
}

// Define your PR templates here - update these based on your actual templates
const PR_TEMPLATES: PRTemplate[] = [
  { name: "Bug Fix", filename: "bug_fix.md" },
  { name: "Feature", filename: "feature.md" },
  { name: "Documentation", filename: "documentation.md" },
  { name: "Hotfix", filename: "hotfix.md" },
];

export default function PRLinker() {
  const [username, setUsername] = useState("");
  const [repository, setRepository] = useState("apt-swarm"); // Default to your repo
  const [branch, setBranch] = useState("");

  // Your main branch - update this if different
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

        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="username"
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: 600,
            }}
          >
            GitHub Username:
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onInput={(e) => setUsername((e.target as HTMLInputElement).value)}
            placeholder="e.g., neuroverse-fm"
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              border: "1px solid var(--sl-color-gray-4)",
              borderRadius: "6px",
              fontSize: "14px",
              boxSizing: "border-box",
              background: "var(--sl-color-white)",
              color: "black",
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="repository"
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: 600,
            }}
          >
            Repository Name:
          </label>
          <input
            id="repository"
            type="text"
            value={repository}
            onInput={(e) => setRepository((e.target as HTMLInputElement).value)}
            placeholder="e.g., apt-swarm"
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              border: "1px solid var(--sl-color-gray-4)",
              borderRadius: "6px",
              fontSize: "14px",
              boxSizing: "border-box",
              background: "var(--sl-color-white)",
              color: "black",
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="branch"
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: 600,
            }}
          >
            Branch Name:
          </label>
          <input
            id="branch"
            type="text"
            value={branch}
            onInput={(e) => setBranch((e.target as HTMLInputElement).value)}
            placeholder="e.g., feature/new-feature"
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              border: "1px solid var(--sl-color-gray-4)",
              borderRadius: "6px",
              fontSize: "14px",
              boxSizing: "border-box",
              background: "var(--sl-color-white)",
              color: "black",
            }}
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
              style={{
                background: "var(--sl-color-gray-6)",
                padding: "0.2rem 0.4rem",
                borderRadius: "3px",
                fontFamily: "var(--sl-font-mono)",
                color: "var(--sl-color-text)",
              }}
            >
              {(username !== "neuroverse-fm"
                ? (username || "your-name") + ":"
                : "") + (branch || "your-branch")}
            </code>{" "}
            →{" "}
            <code
              style={{
                background: "var(--sl-color-gray-6)",
                padding: "0.2rem 0.4rem",
                borderRadius: "3px",
                fontFamily: "var(--sl-font-mono)",
                color: "var(--sl-color-text)",
              }}
            >
              {username === "neuroverse-fm"
                ? mainBranch
                : `neuroverse-fm:${mainBranch}`}
            </code>
          </small>
        </div>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h4 style={{ marginBottom: "1rem" }}>Open Diff with Template:</h4>

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
            style={{
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "6px",
              background: isFormValid
                ? "var(--sl-color-blue)"
                : "var(--sl-color-gray-4)",
              color: isFormValid ? "white" : "var(--sl-color-gray-2)",
              cursor: isFormValid ? "pointer" : "not-allowed",
              fontSize: "14px",
              fontWeight: 500,
              transition: "all 0.2s ease",
            }}
          >
            Open Basic Diff
          </button>

          {PR_TEMPLATES.map((template) => (
            <button
              key={template.filename}
              onClick={() => openDiff(template)}
              disabled={!isFormValid}
              style={{
                padding: "0.5rem 1rem",
                border: "none",
                borderRadius: "6px",
                background: isFormValid
                  ? "var(--sl-color-blue)"
                  : "var(--sl-color-gray-4)",
                color: isFormValid ? "white" : "var(--sl-color-gray-2)",
                cursor: isFormValid ? "pointer" : "not-allowed",
                fontSize: "14px",
                fontWeight: 500,
                transition: "all 0.2s ease",
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
