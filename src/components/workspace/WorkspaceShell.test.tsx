import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { WorkspaceShell } from "./WorkspaceShell";
import { generateUniverse } from "../../lib/recommendation";
const { runAction } = vi.hoisted(() => ({ runAction: vi.fn() }));
vi.mock("convex/react", () => ({
  useQuery: () => undefined,
  useMutation: () => vi.fn(),
  useAction: () => runAction,
}));
beforeEach(() => {
  history.replaceState({}, "", "/app");
  vi.stubGlobal("scrollTo", vi.fn());
});
afterEach(cleanup);
describe("WorkspaceShell", () => {
  it("shows the action-first Content Brain home and primary navigation", () => {
    render(<WorkspaceShell current="/app" name="Hrishikesh" />);
    expect(
      screen.getByRole("heading", {
        name: "What are you working on?",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Workspace" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Content Brain tools" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /find me an idea/i }),
    ).toBeInTheDocument();
  });
  it("opens a tool inline and asks only for the idea", async () => {
    const user = userEvent.setup();
    render(<WorkspaceShell current="/app" />);
    await user.click(
      screen.getByRole("button", { name: /make this idea stronger/i }),
    );
    expect(
      screen.getByRole("textbox", { name: /what's the rough idea/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/complete saved content universe/i),
    ).toBeInTheDocument();
  });
  it("prefills Content Brain from a shared Yap topic once",()=>{sessionStorage.setItem("suchamojo:content-brain-prefill","Why AI makes taste more valuable");render(<WorkspaceShell current="/app"/>);expect(screen.getByPlaceholderText("Drop an idea, question, story, or rough script...")).toHaveValue("Why AI makes taste more valuable");expect(sessionStorage.getItem("suchamojo:content-brain-prefill")).toBeNull()});
  it("sends the complete Universe to a specialist and renders its result", async () => {
    const user = userEvent.setup();
    const universe = generateUniverse({
      character: "I moved from journalism into creator strategy.",
      gifts: "Storytelling and content systems",
      obsessions: "AI and creators",
      expressionFormats: "Talking | Teaching",
    });
    runAction.mockResolvedValueOnce({
      id: "generation-1",
      title: "5 ideas from your brain",
      resultJson: JSON.stringify({
        ideas: [
          {
            title: "The useful idea",
            angle: "A grounded angle",
            whyThisFitsYou: "Your journalism background",
            hook: "Most experts do not lack ideas.",
            recommendedFormat: "Talking video",
          },
        ],
      }),
    });
    render(
      <WorkspaceShell
        current="/app"
        ownerKey="signed-in"
        universe={universe}
      />,
    );
    await user.click(screen.getByRole("button", { name: /find me an idea/i }));
    await user.click(
      screen.getByRole("button", { name: /use my content brain/i }),
    );
    expect(runAction).toHaveBeenCalledWith(
      expect.objectContaining({
        tool: "idea",
        universeJson: JSON.stringify({ universe, savedStories: [] }),
      }),
    );
    expect(
      await screen.findByRole("heading", { name: "5 ideas from your brain" }),
    ).toBeInTheDocument();
    expect(screen.getByText("The useful idea")).toBeInTheDocument();
  });
  it("opens the command menu with Command K and launches capture", async () => {
    const user = userEvent.setup();
    render(<WorkspaceShell current="/app" />);
    await user.keyboard("{Meta>}k{/Meta}");
    const menu = screen.getByRole("dialog", { name: /command menu/i });
    expect(menu).toBeInTheDocument();
    await user.click(
      within(menu).getByRole("button", { name: /capture something/i }),
    );
    expect(
      screen.getByRole("dialog", { name: /what do you want to remember/i }),
    ).toBeInTheDocument();
  });
  it("shows Discover as coming soon", () => {
    render(<WorkspaceShell current="/app/discover" />);
    expect(
      screen.getByRole("heading", { name: "Discover" }),
    ).toBeInTheDocument();
    expect(screen.getByText("COMING SOON")).toBeInTheDocument();
  });
});
