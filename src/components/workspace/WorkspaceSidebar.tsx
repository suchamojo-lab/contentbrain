import type { WorkspacePath } from "../../routing/routes";
import { navigateTo } from "../../routing/routes";
import { workspaceNav } from "./workspaceNav";
export function WorkspaceSidebar({
  current,
  collapsed,
  mobileOpen = false,
  onToggle,
  onMobileClose,
}: {
  current: WorkspacePath;
  collapsed: boolean;
  mobileOpen?: boolean;
  onToggle: () => void;
  onMobileClose?: () => void;
}) {
  const go = (path: WorkspacePath) => {
    navigateTo(path);
    onMobileClose?.();
  };
  return (
    <aside
      className={`workspace-sidebar ${collapsed ? "is-collapsed" : ""} ${mobileOpen ? "is-mobile-open" : ""}`}
    >
      <header>
        <button className="workspace-brand" onClick={() => go("/app")}>
          <span>
            CONTENT BRAIN<small>Your workspace</small>
          </span>
        </button>
        <button
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? "→" : "←"}
        </button>
        <button
          className="sidebar-mobile-close"
          onClick={onMobileClose}
          aria-label="Close navigation"
        >
          ×
        </button>
      </header>
      <nav aria-label="Workspace">
        {workspaceNav.map((item) => (
          <div className="sidebar-nav-item" key={item.path}>
            {item.section ? (
              <small className="sidebar-section-label">{item.section}</small>
            ) : null}
            <button
              className={current === item.path ? "is-active" : ""}
              onClick={() => go(item.path)}
              aria-current={current === item.path ? "page" : undefined}
            >
              <i>{item.mark}</i>
              <span>{item.label}</span>
              {item.later ? <small>SOON</small> : null}
            </button>
          </div>
        ))}
      </nav>
      <footer>
        <div className="brain-meter">
          <i />
          <span>
            <strong>YOUR BRAIN</strong>
            <small>Content Universe ready</small>
          </span>
          <button onClick={() => go("/app/train")}>TRAIN →</button>
        </div>
        <button onClick={() => navigateTo("/")}>
          <i>↙</i>
          <span>Public website</span>
        </button>
      </footer>
    </aside>
  );
}
