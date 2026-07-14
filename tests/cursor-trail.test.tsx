import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CursorTrail } from "@/components/cursor-trail";

type MediaState = {
  finePointer: boolean;
  reducedMotion: boolean;
};

function installMatchMedia(initialState: MediaState) {
  let state = initialState;
  const queries: Array<{
    listeners: Set<(event: MediaQueryListEvent) => void>;
    mediaQuery: MediaQueryList;
  }> = [];

  const matches = (query: string) => {
    if (query.includes("prefers-reduced-motion: reduce")) {
      return state.reducedMotion;
    }

    if (query.includes("prefers-reduced-motion: no-preference")) {
      return state.finePointer && !state.reducedMotion;
    }

    if (query.includes("pointer: fine") || query.includes("hover: hover")) {
      return state.finePointer;
    }

    return false;
  };

  vi.spyOn(window, "matchMedia").mockImplementation((query: string) => {
    const listeners = new Set<(event: MediaQueryListEvent) => void>();
    const mediaQuery = {
      get matches() {
        return matches(query);
      },
      media: query,
      onchange: null,
      addEventListener: (
        _type: string,
        listener: EventListenerOrEventListenerObject,
      ) => listeners.add(listener as (event: MediaQueryListEvent) => void),
      removeEventListener: (
        _type: string,
        listener: EventListenerOrEventListenerObject,
      ) => listeners.delete(listener as (event: MediaQueryListEvent) => void),
      addListener: (listener: (event: MediaQueryListEvent) => void) =>
        listeners.add(listener),
      removeListener: (listener: (event: MediaQueryListEvent) => void) =>
        listeners.delete(listener),
      dispatchEvent: () => true,
    } as MediaQueryList;

    queries.push({ listeners, mediaQuery });
    return mediaQuery;
  });

  return {
    setState(nextState: MediaState) {
      state = nextState;
      for (const { listeners, mediaQuery } of queries) {
        const event = { matches: mediaQuery.matches } as MediaQueryListEvent;
        for (const listener of listeners) listener(event);
      }
    },
  };
}

afterEach(() => {
  document.documentElement.classList.remove("cursor-trail-active");
  vi.restoreAllMocks();
});

describe("CursorTrail", () => {
  it("activates for fine hover input and responds to capability changes", () => {
    const media = installMatchMedia({
      finePointer: true,
      reducedMotion: false,
    });
    render(<CursorTrail />);

    expect(document.documentElement).toHaveClass("cursor-trail-active");

    act(() => {
      media.setState({ finePointer: false, reducedMotion: false });
    });
    expect(document.documentElement).not.toHaveClass("cursor-trail-active");

    act(() => {
      media.setState({ finePointer: true, reducedMotion: false });
    });
    expect(document.documentElement).toHaveClass("cursor-trail-active");

    act(() => {
      media.setState({ finePointer: true, reducedMotion: true });
    });
    expect(document.documentElement).not.toHaveClass("cursor-trail-active");
  });

  it("removes its activation class during cleanup", () => {
    installMatchMedia({ finePointer: true, reducedMotion: false });
    const { unmount } = render(<CursorTrail />);

    expect(document.documentElement).toHaveClass("cursor-trail-active");
    unmount();
    expect(document.documentElement).not.toHaveClass("cursor-trail-active");
  });

  it("keeps the custom trail inactive when reduced motion is requested", () => {
    installMatchMedia({ finePointer: true, reducedMotion: true });
    render(<CursorTrail />);

    expect(document.documentElement).not.toHaveClass("cursor-trail-active");
  });
});
