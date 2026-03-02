
import { PageHeader } from "@/components/shared/PageHeader";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ItineraryForm } from "./ItineraryForm";
import { RecommendationsForm } from "./RecommendationsForm";

export default function AiGuidePage() {
    const headerImage = PlaceHolderImages.find((img) => img.id === 'exp-stargazing');

    return (
        <div>
             {headerImage && (
                <PageHeader
                title="AI Powered Travel Guide"
                subtitle="Your personal concierge for exploring Himachal."
                imageUrl={headerImage.imageUrl}
                imageHint={headerImage.imageHint}
                />
            )}
            <section>
                <div className="container mx-auto px-4 max-w-4xl">
                     <Tabs defaultValue="itinerary" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 max-w-2xl mx-auto h-14 p-1.5 rounded-full bg-muted/50 border border-border/50 mb-12">
                            <TabsTrigger 
                                value="itinerary" 
                                className="rounded-full h-11 text-base font-bold transition-all data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=active]:shadow-md"
                            >
                                Personalized Itinerary
                            </TabsTrigger>
                            <TabsTrigger 
                                value="recommendations" 
                                className="rounded-full h-11 text-base font-bold transition-all data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=active]:shadow-md"
                            >
                                Local Recommendations
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="itinerary" className="mt-0">
                            <ItineraryForm />
                        </TabsContent>
                        <TabsContent value="recommendations" className="mt-0">
                            <RecommendationsForm />
                        </TabsContent>
                    </Tabs>
                </div>
            </section>
        </div>
    );
}
