import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CursorTrail } from "@/components/cursor-trail";

type MediaState = {
  finePointer: boolean;
  hoverCapable: boolean;
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
      return (
        state.hoverCapable && state.finePointer && !state.reducedMotion
      );
    }

    if (query.includes("pointer: fine")) {
      return state.finePointer;
    }

    if (query.includes("hover: hover")) {
      return state.hoverCapable;
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
  it("installs, removes, and reinstalls one pointer listener as eligibility changes", () => {
    const addEventListener = vi.spyOn(window, "addEventListener");
    const removeEventListener = vi.spyOn(window, "removeEventListener");
    const media = installMatchMedia({
      finePointer: true,
      hoverCapable: true,
      reducedMotion: false,
    });
    const { unmount } = render(<CursorTrail />);

    const pointerAdds = () =>
      addEventListener.mock.calls.filter(([type]) => type === "pointermove");
    const pointerRemovals = () =>
      removeEventListener.mock.calls.filter(([type]) => type === "pointermove");

    expect(document.documentElement).toHaveClass("cursor-trail-active");
    expect(pointerAdds()).toHaveLength(1);
    const pointerMove = pointerAdds()[0][1];
    const initialRemovalCount = pointerRemovals().length;

    act(() => {
      media.setState({
        finePointer: true,
        hoverCapable: false,
        reducedMotion: false,
      });
    });
    expect(document.documentElement).not.toHaveClass("cursor-trail-active");
    expect(pointerAdds()).toHaveLength(1);
    expect(pointerRemovals()).toHaveLength(initialRemovalCount + 1);
    expect(pointerRemovals().at(-1)?.[1]).toBe(pointerMove);

    act(() => {
      media.setState({
        finePointer: true,
        hoverCapable: true,
        reducedMotion: false,
      });
    });
    expect(document.documentElement).toHaveClass("cursor-trail-active");
    expect(pointerAdds()).toHaveLength(2);
    expect(pointerAdds()[1][1]).toBe(pointerMove);
    expect(pointerRemovals()).toHaveLength(initialRemovalCount + 2);
    expect(pointerRemovals().at(-1)?.[1]).toBe(pointerMove);

    unmount();
    expect(document.documentElement).not.toHaveClass("cursor-trail-active");
    expect(pointerAdds()).toHaveLength(2);
    expect(pointerRemovals()).toHaveLength(initialRemovalCount + 3);
    expect(pointerRemovals().at(-1)?.[1]).toBe(pointerMove);
  });

  it("keeps the custom trail inactive when reduced motion is requested", () => {
    const addEventListener = vi.spyOn(window, "addEventListener");
    installMatchMedia({
      finePointer: true,
      hoverCapable: true,
      reducedMotion: true,
    });
    render(<CursorTrail />);

    expect(document.documentElement).not.toHaveClass("cursor-trail-active");
    expect(
      addEventListener.mock.calls.filter(([type]) => type === "pointermove"),
    ).toHaveLength(0);
  });

  it("keeps fine pointer input inactive when hover is unavailable", () => {
    const addEventListener = vi.spyOn(window, "addEventListener");
    installMatchMedia({
      finePointer: true,
      hoverCapable: false,
      reducedMotion: false,
    });
    render(<CursorTrail />);

    expect(document.documentElement).not.toHaveClass("cursor-trail-active");
    expect(
      addEventListener.mock.calls.filter(([type]) => type === "pointermove"),
    ).toHaveLength(0);
  });
});
