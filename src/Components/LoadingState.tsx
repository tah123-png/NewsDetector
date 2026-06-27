import { useEffect, useState } from 'react';

const steps = [
  { icon: '🔗', label: 'Fetching content...' },
  { icon: '🧠', label: 'Running NLP analysis...' },
  { icon: '📊', label: 'Cross-referencing sources...' },
  { icon: '🔍', label: 'Checking claim database...' },
  { icon: '✨', label: 'Generating verdict...' },
];

interface Props {
  type: 'url' | 'image';
}

const LoadingState = ({ type }: Props) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((p) => (p < steps.length - 1 ? p + 1 : p));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-fade-in glass-card p-6 text-center">
      {/* Pulsing icon */}
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-glow flex items-center justify-center text-3xl animate-pulse-glow relative">
        {type === 'image' ? '🖼️' : '🔗'}
        <svg
          className="absolute -inset-1 w-[calc(100%+8px)] h-[calc(100%+8px)] animate-spin-slow"
          viewBox="0 0 88 88"
        >
          <circle cx="44" cy="44" r="40" fill="none" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" strokeDasharray="60 180" />
        </svg>
      </div>

      <h3 className="text-xl font-bold font-display text-txt-primary mb-2">
        Analyzing {type === 'image' ? 'Image' : 'Article'}...
      </h3>
      <p className="text-sm text-txt-secondary mb-5">Our AI is carefully examining the content</p>

      {/* Steps */}
      <div className="flex flex-col gap-2 max-w-xs mx-auto mb-2 text-left">
        {steps.map((step, i) => (
          <div
            key={step.label}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] border transition-all duration-400"
            style={{
              background: i <= currentStep ? 'var(--color-accent-glow)' : 'var(--color-bg-secondary)',
              borderColor: i <= currentStep ? 'var(--color-border-focus)' : 'var(--color-border)',
              opacity: i > currentStep + 1 ? 0.4 : 1,
            }}
          >
            <span className="text-lg">{i < currentStep ? '✅' : step.icon}</span>
            <span
              className="text-[13px] transition-colors"
              style={{
                fontWeight: i <= currentStep ? 600 : 400,
                color: i <= currentStep ? 'var(--color-accent)' : 'var(--color-text-muted)',
              }}
            >
              {step.label}
            </span>
            {i === currentStep && (
              <span className="ml-auto flex gap-[3px] items-center">
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="w-[5px] h-[5px] rounded-full bg-accent animate-bounce"
                    style={{ animationDelay: `${d * 0.15}s` }}
                  />
                ))}
              </span>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default LoadingState;
