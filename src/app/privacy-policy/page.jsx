
import { PrivacyBanner } from "@/components/shared/PrivacyBanner";

export const metadata = {
  title: 'Privacy Policy - The Forest Gate',
  description: 'Our commitment to protecting your personal data and privacy at The Forest Gate.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background">
      <PrivacyBanner />
      
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-stone dark:prose-invert max-w-none space-y-8">
            <div>
              <h2 className="font-headline text-3xl font-bold mb-4">Introduction</h2>
              <p className="text-foreground/80 leading-relaxed">
                At The Forest Gate, we are committed to maintaining the trust and confidence of our visitors to our web site. In particular, we want you to know that The Forest Gate is not in the business of selling, renting or trading email lists with other companies and businesses for marketing purposes.
              </p>
            </div>

            <div>
              <h2 className="font-headline text-3xl font-bold mb-4">Types of Data We Collect</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Cookies</h3>
                <p className="text-foreground/80">
                  Our website use cookies to collect information. This includes information about browsing and purchasing behavior by people who access our website. This includes information about pages viewed, products purchased and the customer journey around our website.
                </p>
                
                <h3 className="text-xl font-bold">Google Analytics</h3>
                <p className="text-foreground/80">
                  When someone visits our website we use a third party service, Google Analytics, to collect standard internet log information and details of visitor behavior patterns. We do this to find out things such as the number of visitors to the various parts of the site.
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-headline text-3xl font-bold mb-4">Guest Information</h2>
              <p className="text-foreground/80 leading-relaxed">
                When you book a stay at The Forest Gate, your name, address data, email and contact number will be stored in our guest management system. Please be assured that we do not share your personal details with any other third party without your explicit consent.
              </p>
            </div>

            <div>
              <h2 className="font-headline text-3xl font-bold mb-4">Access to Your Personal Information</h2>
              <p className="text-foreground/80 leading-relaxed">
                You are entitled to view, amend, or delete the personal information that we hold. Email your request to our data protection officer at <span className="font-bold text-primary">privacy@theforestgate.com</span>.
              </p>
            </div>

            <div>
              <h2 className="font-headline text-3xl font-bold mb-4">Changes to this Privacy Notice</h2>
              <p className="text-foreground/80 leading-relaxed italic">
                This policy was last updated on March 2nd, 2024.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
