'use client'

import React, { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Loader2, CheckCircle } from 'lucide-react'
import type { PartnershipBlock as PartnershipBlockProps } from '@/payload-types'
import type { PartnershipFormData } from '@/app/(frontend)/api/partnership/route'
import { COUNTRIES } from '@/lib/countries'

const PARTNERSHIP_TYPES = [
  'Distributor',
  'Retailer',
  'Wholesaler',
  'B2B Buyer',
  'Brand Ambassador',
  'White Label',
  'Other',
]

type FormState = { error: string }

async function submitPartnership(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const data: PartnershipFormData = {
    companyName: formData.get('companyName') as string,
    contactName: formData.get('contactName') as string,
    email: formData.get('email') as string,
    phone: (formData.get('phone') as string) || '',
    country: (formData.get('country') as string) || '',
    partnershipType: (formData.get('partnershipType') as string) || '',
    message: formData.get('message') as string,
  }

  try {
    const res = await fetch('/api/partnership', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error()
    return { error: '' }
  } catch {
    return { error: 'Something went wrong. Please try again.' }
  }
}

export const PartnershipBlock: React.FC<PartnershipBlockProps> = ({ heading, description }) => {
  const [state, formAction] = useActionState(submitPartnership, { error: '' })
  // Track submission count so we can detect a successful submit (error cleared after submit)
  const [submits, setSubmits] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)

  // Detect successful submission: action ran (submits > 0) and returned no error
  React.useEffect(() => {
    if (submits > 0 && state.error === '') setShowSuccess(true)
  }, [state, submits])

  function handleFormAction(formData: FormData) {
    setSubmits((n) => n + 1)
    React.startTransition(() => formAction(formData))
  }

  if (showSuccess) {
    return (
      <section className="py-24 bg-gradient-to-b from-[#6B0F2B] via-[#8B1538] to-[#6B0F2B]">
        <div className="container mx-auto px-4 max-w-xl text-center">
          <CheckCircle className="w-16 h-16 text-white mx-auto pb-6" />
          <h2 className="text-3xl text-white pb-4">Thank You!</h2>
          <p className="text-white/70 text-lg">
            We've received your partnership inquiry and will get back to you within 1–2 business days.
          </p>
          <button
            onClick={() => { setShowSuccess(false); setSubmits(0) }}
            className="pt-8 px-6 py-3 bg-white text-[#8B1538] rounded-xl font-medium hover:bg-white/90 transition-colors"
          >
            Send Another Inquiry
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 bg-gradient-to-b from-[#6B0F2B] via-[#8B1538] to-[#6B0F2B] relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center pb-12">
          <div className="inline-flex items-center gap-2 pb-4">
            <div className="h-px w-12 bg-white/50" />
            <div className="text-white/70 uppercase tracking-wider text-sm">Partner With Us</div>
            <div className="h-px w-12 bg-white/50" />
          </div>
          <h2 className="text-4xl md:text-5xl text-white pb-4">
            {heading ?? 'Become a Partner'}
          </h2>
          {description && (
            <p className="text-white/70 text-lg max-w-2xl mx-auto">{description}</p>
          )}
        </div>

        <form action={handleFormAction} className="max-w-2xl mx-auto space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Company Name *">
              <input required name="companyName" className={inputClass} placeholder="Acme Corp" />
            </Field>
            <Field label="Contact Person *">
              <input required name="contactName" className={inputClass} placeholder="Jane Smith" />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Email Address *">
              <input required type="email" name="email" className={inputClass} placeholder="jane@company.com" />
            </Field>
            <Field label="Phone Number">
              <input type="tel" name="phone" className={inputClass} placeholder="+1 234 567 8900" />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Country">
              <select name="country" className={inputClass}>
                <option value="">Select country...</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.name}>{c.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Partnership Type">
              <select name="partnershipType" className={inputClass}>
                <option value="">Select type...</option>
                {PARTNERSHIP_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Message *">
            <textarea
              required
              name="message"
              rows={5}
              className={`${inputClass} resize-none`}
              placeholder="Tell us about your business and how you'd like to partner with us..."
            />
          </Field>

          {state.error && (
            <p className="text-red-300 text-sm text-center">{state.error}</p>
          )}

          <SubmitButton />
        </form>
      </div>
    </section>
  )
}

// useFormStatus must live in a component that is a child of the <form>
function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-white text-[#8B1538] py-4 rounded-xl font-semibold text-base hover:bg-white/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {pending ? (
        <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
      ) : (
        'Send Partnership Inquiry'
      )}
    </button>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-white/70 pb-1.5 uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputClass =
  'w-full border border-white/20 rounded-xl px-4 py-3 text-sm bg-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-colors'
