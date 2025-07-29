"use client";
import { useState, useEffect } from "react";

function Consent({ value, onChange }) {
  const [hasConsent, setHasConsent] = useState(value ?? false);
  const [showConsentDetails, setShowConsentDetails] = useState(false);

  useEffect(() => {
    if (typeof value === "boolean") setHasConsent(value);
  }, [value]);

  const handleConsentChange = (checked) => {
    setHasConsent(checked);
    localStorage.setItem("hasConsent", checked);
    if (onChange) onChange(checked);
  };

  return (
    <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-start gap-3">
        <input
          id="consent"
          type="checkbox"
          checked={hasConsent}
          onChange={(e) => handleConsentChange(e.target.checked)}
          className="mt-1 w-4 h-4 text-primary-dark border-gray-300 rounded"
        />
        <label htmlFor="consent" className="text-sm text-gray-800 flex-1">
          <span className="font-semibold block mb-2">
            Terms and Conditions for Using Facial Recognition System
          </span>
          <button
            type="button"
            className="text-blue-600 underline text-xs"
            onClick={() => setShowConsentDetails((v) => !v)}
          >
            {showConsentDetails ? "Hide details" : "Read more"}
          </button>

          {showConsentDetails && (
            <div className="mt-4 text-xs text-gray-700 space-y-4">
              <section>
                <h4 className="font-medium text-gray-900 mb-2">
                  Precautions for Using Facial Recognition:
                </h4>
                <ul className="list-disc ml-5 space-y-1">
                  <li>
                    Do not upload other people&apos;s facial images without their permission.
                    If necessary, obtain consent from the individual or their guardian.
                  </li>
                  <li>
                    Do not edit, share, or use photos in any illegal, unethical, or immoral way.
                  </li>
                </ul>
              </section>

              <section>
                <h4 className="font-medium text-gray-900 mb-2">
                  Public Notice of Facial Information Processing Rules:
                </h4>
                <ul className="list-decimal ml-5 space-y-1">
                  <li>
                    Facial information is personal data. Refusing to provide it will not affect
                    your ability to view photo albums.
                  </li>
                  <li>
                    If the album manager enables the &quot;Search by Face&quot; feature, users can upload
                    a face to search for related photos. Results are only shown to the searcher.
                  </li>
                  <li>
                    If &quot;Automatic Facial Recognition&quot; is enabled, faces in images will be
                    detected and listed below the image. Clicking a face performs a search.
                  </li>
                  <li>
                    The system does not collect, store, or share facial data for any purpose
                    other than face-based photo search.
                  </li>
                </ul>
              </section>

              <section>
                <h4 className="font-medium text-gray-900 mb-2">Disclaimer:</h4>
                <ul className="list-disc ml-5 space-y-1">
                  <li>
                    You may request the album manager to stop using facial recognition features
                    related to your personal data at any time.
                  </li>
                  <li>
                    Using facial data of others requires proper authorization.
                    Avoid infringing on the rights of others.
                  </li>
                  <li>
                    The album manager is responsible for enabling facial recognition only
                    with legal authorization.
                  </li>
                  <li>
                    Any disputes or liabilities resulting from unauthorized use of facial
                    recognition are not the responsibility of the platform or its providers.
                  </li>
                </ul>
              </section>
            </div>
          )}
        </label>
      </div>
    </div>
  );
}

export default Consent;
