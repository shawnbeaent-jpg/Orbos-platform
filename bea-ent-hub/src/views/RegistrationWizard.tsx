import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, FileSignature } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { SUBSCRIPTION_PLANS } from '../data/mockData';
import { UserRole, SubscriptionTierId } from '../types';
import { Card, formatCents } from '../components/ui';
import SignaturePad from '../components/SignaturePad';

const STEPS = ['Identity', 'Choose Plan', 'Execute Contract'];

const RegistrationWizard: React.FC = () => {
  const { registerIndieUser, addSignature } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole.INDIE | UserRole.PRODUCER>(UserRole.INDIE);
  const [plan, setPlan] = useState<SubscriptionTierId>('Hustler');
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);

  const selectedPlan = SUBSCRIPTION_PLANS.find((p) => p.id === plan)!;
  const canProceedIdentity = name.trim().length > 1 && /\S+@\S+\.\S+/.test(email);
  const canSubmit = !!signatureDataUrl && agreed;

  const submit = () => {
    if (!canSubmit) return;
    const user = registerIndieUser({ name: name.trim(), email: email.trim(), role, plan });
    addSignature({
      id: `sig-${Date.now()}`,
      signerName: name.trim(),
      role,
      planChosen: plan,
      signatureDataUrl: signatureDataUrl!,
      signedAt: new Date().toISOString(),
    });
    void user;
    navigate('/app/dashboard');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-midnight-950 px-6 py-16">
      <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
      <div className="relative w-full max-w-2xl">
        <button onClick={() => navigate('/independent')} className="btn-ghost mb-6 text-xs">
          <ArrowLeft size={14} /> Back
        </button>

        <div className="mb-8 flex items-center justify-center gap-3">
          {STEPS.map((label, idx) => (
            <div key={label} className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border font-mono text-xs ${
                  idx <= step ? 'border-gold-500/60 bg-gold-500/15 text-gold-200' : 'border-white/10 text-charcoal-600'
                }`}
              >
                {idx < step ? <Check size={14} /> : idx + 1}
              </div>
              <span className={`text-xs ${idx <= step ? 'text-gold-200' : 'text-charcoal-600'}`}>{label}</span>
              {idx < STEPS.length - 1 && <div className="h-px w-8 bg-white/10" />}
            </div>
          ))}
        </div>

        <Card>
          {step === 0 && (
            <div>
              <h2 className="mb-1 font-serif text-xl text-gold-100">Tell us who you are</h2>
              <p className="mb-5 text-sm text-charcoal-500">This activates your Independent Mode account.</p>
              <div className="space-y-4">
                <div>
                  <p className="label-mono mb-1.5">Account Type</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setRole(UserRole.INDIE)}
                      className={`flex-1 rounded-lg border px-3 py-2.5 text-sm font-medium transition ${role === UserRole.INDIE ? 'border-gold-500/50 bg-gold-500/15 text-gold-200' : 'border-white/10 text-charcoal-500 hover:border-gold-500/30'}`}
                    >
                      Indie Artist (DIY)
                    </button>
                    <button
                      onClick={() => setRole(UserRole.PRODUCER)}
                      className={`flex-1 rounded-lg border px-3 py-2.5 text-sm font-medium transition ${role === UserRole.PRODUCER ? 'border-gold-500/50 bg-gold-500/15 text-gold-200' : 'border-white/10 text-charcoal-500 hover:border-gold-500/30'}`}
                    >
                      Music Producer
                    </button>
                  </div>
                </div>
                <div>
                  <p className="label-mono mb-1.5">Full Name</p>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="input-dark" placeholder="Your artist or legal name" />
                </div>
                <div>
                  <p className="label-mono mb-1.5">Email</p>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="input-dark" placeholder="you@email.com" />
                </div>
              </div>
              <button disabled={!canProceedIdentity} onClick={() => setStep(1)} className="btn-gold mt-6 w-full disabled:cursor-not-allowed disabled:opacity-40">
                Continue <ArrowRight size={14} />
              </button>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="mb-1 font-serif text-xl text-gold-100">Choose your plan</h2>
              <p className="mb-5 text-sm text-charcoal-500">
                {role === UserRole.PRODUCER
                  ? 'Hitmaker unlocks Producer Console beat submissions — recommended for producers.'
                  : 'Mogul unlocks the Operating Agreement Generator and unlimited campaigns.'}
              </p>
              <div className="space-y-3">
                {SUBSCRIPTION_PLANS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPlan(p.id)}
                    className={`w-full rounded-lg border p-4 text-left transition ${plan === p.id ? 'border-gold-500/50 bg-gold-500/10' : 'border-white/10 hover:border-gold-500/30'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-lg text-gold-100">{p.id}</span>
                      <span className="font-mono text-sm text-gold-300">{formatCents(p.monthlyCostCents)}/mo</span>
                    </div>
                    <p className="mt-1 text-xs text-charcoal-500">{p.tagline}</p>
                    <p className="label-mono mt-1">{p.commissionPct}% platform commission</p>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex gap-2">
                <button onClick={() => setStep(0)} className="btn-ghost flex-1"><ArrowLeft size={14} /> Back</button>
                <button onClick={() => setStep(2)} className="btn-gold flex-1">Continue <ArrowRight size={14} /></button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="mb-1 flex items-center gap-2 font-serif text-xl text-gold-100">
                <FileSignature size={18} className="text-gold-400" /> Execute Onboarding Contract
              </h2>
              <p className="mb-4 text-sm text-charcoal-500">
                Review and sign below to activate your account on the <b className="text-gold-300">{plan}</b> plan.
              </p>
              <div className="scrollbar-gold mb-4 max-h-40 overflow-y-auto rounded-lg border border-white/10 bg-midnight-900/50 p-4 font-mono text-[11px] leading-relaxed text-charcoal-500">
                <p>BEA ENT. COMMAND HUB — INDEPENDENT MODE ONBOARDING AGREEMENT (Specimen)</p>
                <p className="mt-2">This agreement is entered into by {name || '[Name]'} ("User") and BEA ENT. Command Hub as of {new Date().toLocaleDateString()}.</p>
                <p className="mt-2">User elects the {plan} subscription plan at {formatCents(selectedPlan.monthlyCostCents)}/month with a {selectedPlan.commissionPct}% platform commission on applicable transactions processed through the platform.</p>
                <p className="mt-2">User acknowledges this is an in-app account activation record, not a substitute for independent legal counsel on entity formation, royalty registration, or licensing matters.</p>
              </div>
              <SignaturePad onCapture={setSignatureDataUrl} />
              <label className="mt-4 flex items-start gap-2 text-xs text-charcoal-500">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 accent-gold-500" />
                I have reviewed the terms above and authorize this electronic signature to activate my account.
              </label>
              <div className="mt-6 flex gap-2">
                <button onClick={() => setStep(1)} className="btn-ghost flex-1"><ArrowLeft size={14} /> Back</button>
                <button onClick={submit} disabled={!canSubmit} className="btn-gold flex-1 disabled:cursor-not-allowed disabled:opacity-40">
                  Sign &amp; Activate Account
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default RegistrationWizard;
