"use client";

import * as React from "react";
import { Bot, XCircle, CheckCircle2 } from "lucide-react";

type Option = {
  id: string;
  label: string;
};

type QuestionData = {
  id: string;
  stem: string;
  options: Option[];
  correctOptionId: string;
  // Per-option incorrect explanations are supported; provide at least one.
  explanations: {
    correct: string;
    incorrectByOption?: Record<string, string>;
    fallbackIncorrect?: string; // used if selected incorrect option has no specific explanation
  };
};

// Typing effect component
function TypingEffect({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = React.useState("");
  const index = React.useRef(0);

  React.useEffect(() => {
    setDisplayedText(text.charAt(0));
    index.current = 0;
    const intervalId = setInterval(() => {
      if (index.current < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index.current));
        index.current += 1;
      } else {
        clearInterval(intervalId);
        onComplete?.();
      }
    }, 20); // Adjust typing speed here

    return () => clearInterval(intervalId);
  }, [text, onComplete]);

  return <>{displayedText}</>;
}

// Inline callout that appears under the question
function ExplanationCallout({
  title,
  children,
  id,
}: {
  title: string;
  children: React.ReactNode;
  id: string;
}) {
  return (
    <div
      id={id}
      role="region"
      aria-labelledby={`${id}-title`}
      className="mt-3 rounded-2xl border border-border bg-card text-card-foreground p-4 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary">
          <Bot className="w-4 h-4" />
        </div>
        <div id={`${id}-title`} className="text-sm font-semibold">
          {title}
        </div>
        <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full border border-border text-muted-foreground">
          Simulation
        </span>
      </div>
      <div className="text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

// Animated button for Explain Answer
function ExplainAnswerButton({
  onClick,
  open,
}: {
  onClick: () => void;
  open: boolean;
}) {
  return (
    <button className="explain-answer-button" onClick={onClick}>
      <div className="glass-shimmer"></div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className="sparkle"
      >
        <path
          className="path"
          strokeLinejoin="round"
          strokeLinecap="round"
          stroke="currentColor"
          fill="currentColor"
          d="M14.187 8.096L15 5.25L15.813 8.096C16.0231 8.83114 16.4171 9.50062 16.9577 10.0413C17.4984 10.5819 18.1679 10.9759 18.903 11.186L21.75 12L18.904 12.813C18.1689 13.0231 17.4994 13.4171 16.9587 13.9577C16.4181 14.4984 16.0241 15.1679 15.814 15.903L15 18.75L14.187 15.904C13.9769 15.1689 13.5829 14.4994 13.0423 13.9587C12.5016 13.4181 11.8321 13.0241 11.097 12.814L8.25 12L11.096 11.187C11.8311 10.9769 12.5006 10.5829 13.0413 10.0423C13.5819 9.50162 13.9759 8.83214 14.186 8.097L14.187 8.096Z"
        ></path>
        <path
          className="path"
          strokeLinejoin="round"
          strokeLinecap="round"
          stroke="currentColor"
          fill="currentColor"
          d="M6 14.25L5.741 15.285C5.59267 15.8785 5.28579 16.4206 4.85319 16.8532C4.42059 17.2858 3.87853 17.5927 3.285 17.741L2.25 18L3.285 18.259C3.87853 18.4073 4.42059 18.7142 4.85319 19.1468C5.28579 19.5794 5.59267 20.1215 5.741 20.715L6 21.75L6.259 20.715C6.40725 20.1216 6.71398 19.5796 7.14639 19.147C7.5788 18.7144 8.12065 18.4075 8.714 18.259L9.75 18L8.714 17.741C8.12065 17.5925 7.5788 17.2856 7.14639 16.853C6.71398 16.4204 6.40725 15.8784 6.259 15.285L6 14.25Z"
        ></path>
      </svg>
      <span className="text_button">{open ? "Hide Explanation" : "Explain Answer"}</span>
    </button>
  );
}

export function ExplainAnswer({
  question,
  selectedOptionId,
  defaultOpen = false,
}: {
  question: QuestionData;
  selectedOptionId: string | null; // null if the user skipped
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const isCorrect =
    selectedOptionId != null &&
    selectedOptionId === question.correctOptionId;

  // Compute explanation text
  const explanation = React.useMemo(() => {
    if (selectedOptionId == null) {
      // Skipped
      return (
        question.explanations.correct +
        " You didn’t select an answer for this question—review the concept and try similar practice items."
      );
    }
    if (selectedOptionId === question.correctOptionId) {
      return question.explanations.correct;
    }
    const specific =
      question.explanations.incorrectByOption?.[selectedOptionId];
    return (
      specific ||
      question.explanations.fallbackIncorrect ||
      "That choice doesn’t match the core concept tested here. Revisit the key idea and compare it with the correct option."
    );
  }, [question, selectedOptionId]);

  const selectedLabel =
    selectedOptionId &&
    question.options.find((o) => o.id === selectedOptionId)?.label;

  const correctLabel =
    question.options.find((o) => o.id === question.correctOptionId)?.label;

  const explainId = `${question.id}-explain`;

  return (
    <div className="rounded-lg border bg-card text-card-foreground p-4">
      {/* Stem */}
      <div className="text-sm md:text-base text-card-foreground font-medium">
        {question.stem}
      </div>

      {/* Options (read-only) */}
      <ul className="mt-3 space-y-2">
        {question.options.map((opt) => {
          const isSelected = opt.id === selectedOptionId;
          const isRight = opt.id === question.correctOptionId;
          return (
            <li
              key={opt.id}
              className={[
                "flex items-start gap-2 rounded-md border p-3 text-sm",
                isRight
                  ? "border-green-500/30 bg-green-500/10 text-green-700 dark:bg-green-500/[0.06] dark:text-green-400"
                  : "border-border",
                isSelected && !isRight
                  ? "bg-red-500/10 border-red-500/30 text-red-700 dark:bg-red-500/[0.06] dark:text-red-400"
                  : "",
              ].join(" ")}
            >
              <div className="mt-0.5">
                {isRight ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                ) : isSelected ? (
                  <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-muted" />
                )}
              </div>
              <div className="text-card-foreground">{opt.label}</div>
            </li>
          );
        })}
      </ul>

      {/* Answer summary */}
      <div className="mt-3 text-xs md:text-sm text-muted-foreground">
        {selectedOptionId == null ? (
          <span>You did not select an answer.</span>
        ) : isCorrect ? (
          <span>
            Your answer is correct. Correct answer:{" "}
            <span className="text-foreground">{correctLabel}</span>
          </span>
        ) : (
          <span>
            Your answer is incorrect. You chose{" "}
            <span className="text-foreground">{selectedLabel}</span>. Correct
            answer: <span className="text-foreground">{correctLabel}</span>
          </span>
        )}
      </div>

      {/* Explain / Hide button */}
      <div className="mt-3">
        <ExplainAnswerButton
          aria-expanded={open}
          aria-controls={explainId}
          onClick={() => setOpen((v) => !v)} open={open} />
      </div>

      {/* Inline AI callout (no pop-up) */}
      {open && (
        <ExplanationCallout id={explainId} title="AI Explanation • Flippy">
          <TypingEffect text={explanation} />
        </ExplanationCallout>
      )}
    </div>
  );
}