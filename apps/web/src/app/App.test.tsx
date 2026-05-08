import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { App } from "./App";

describe("App", () => {
  afterEach(() => {
    window.localStorage.clear();
    window.history.pushState(null, "", "/");
  });

  it("redirects unauthenticated users to the login page", async () => {
    window.history.pushState(null, "", "/apps");

    render(<App />);

    expect(await screen.findByText("企业级低代码平台 P0")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /登\s*录/ })).toBeInTheDocument();
  });
});
