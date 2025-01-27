import React from 'react'
import { Toaster } from 'react-hot-toast';

const TermsOfService = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div>
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
                    <div className="text-lg font-bold mb-4">Terms Of Service for Providers on TaskColony.com </div>
                    <div>Welcome to TaskColony.com (the "Platform"). By signing up and providing services through our
                        Platform, you agree to the following terms and conditions, which govern your use of the Platform
                        and your relationship with TaskColony LLC ("we," "us," or "our"). Please read these terms carefully
                    </div>

                    <div className="">
                        <div className="">1. Acceptance of Background Checks</div>
                        <div className="">1.1 Consent to Background Checks</div>
                        <div className="">As a condition of registering and providing services on the Platform, you consent to TaskColony
                            conducting background checks. These checks may include, but are not limited to, nationwide
                            criminal background screenings and professional license verifications.</div>
                    </div>

                    <div className="">
                        <div className="">1.2 Third-Party Screening Providers</div>
                        <div className="">We utilize third-party background check providers to perform these screenings. By agreeing to these
                            terms, you authorize us and our third-party providers to collect, process, and store the necessary
                            information required to perform the background checks.
                        </div>
                    </div>

                    <div className="">
                        <div className="">1.3 Scope of Background Checks</div>
                        <div className="">The background checks may include:</div>
                        <div className="">- Criminal history searches on a national, state, and local level.</div>
                        <div className="">- Verification of professional licenses, certifications, or qualifications.</div>
                        <div className="">- Other information relevant to verifying your ability to provide services safely and professionally.</div>
                    </div>

                    <div className="">
                        <div className="">1.4 Your Responsibility</div>
                        <div className="">You acknowledge that you are responsible for providing accurate and up-to-date information
                            required to conduct the background checks. Any false, misleading, or incomplete information may
                            result in suspension or termination of your account.
                        </div>
                    </div>

                    <div className="">
                        <div className="">1.5 Payment for Background Checks</div>
                        <div className="">You agree that you are financially responsible for the cost of the background checks, which will
                            either be deducted from your earnings or charged directly to you, as outlined during the registration
                            process.
                        </div>
                    </div>

                    <div className="flex justify-end mt-4">
                        <button className="bg-secondary text-white px-4 py-2 rounded" onClick={onClose}>
                            Ok
                        </button>
                    </div>
                </div>
                <Toaster />

            </div>
        </div>
    )
}

export default TermsOfService
