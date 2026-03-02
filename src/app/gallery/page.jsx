
import Image from 'next/image';
import { PageHeader } from '@/components/shared/PageHeader';
import { galleryImages } from '../lib/data';
import { PlaceHolderImages } from '../../lib/placeholder-images';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const categories = ['Nature', 'Rooms', 'Activities', 'Pool & Cinema', 'Events & Night Views'];

export default function GalleryPage() {
    const headerImage = PlaceHolderImages.find((img) => img.id === 'gallery-nature-1');

    return (
        <div>
             {headerImage && (
                <PageHeader
                title="Gallery"
                subtitle="A glimpse into the beauty and serenity of Himachal Haven."
                imageUrl={headerImage.imageUrl}
                imageHint={headerImage.imageHint}
                />
            )}

            <section>
                <div className="container mx-auto px-4">
                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="flex flex-wrap items-center justify-center gap-2 mx-auto max-w-5xl h-auto p-2 rounded-full bg-muted/50 border border-border/50 mb-12">
                        <TabsTrigger 
                            value="all" 
                            className="rounded-full px-6 py-2.5 text-sm font-bold transition-all data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=active]:shadow-md"
                        >
                            All
                        </TabsTrigger>
                        {categories.map(category => (
                             <TabsTrigger 
                                key={category} 
                                value={category} 
                                className="rounded-full px-6 py-2.5 text-sm font-bold transition-all data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=active]:shadow-md"
                            >
                                {category}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    
                    <TabsContent value="all" className="mt-8">
                        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                            {galleryImages.map(image => {
                                const imageData = PlaceHolderImages.find(p => p.id === image.id);
                                if (!imageData) return null;
                                return (
                                    <div key={image.id} className="break-inside-avoid">
                                        <Image src={imageData.imageUrl} alt={imageData.description} width={500} height={500} className="w-full h-auto rounded-[2rem] shadow-md" data-ai-hint={imageData.imageHint} placeholder="blur" blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg==" />
                                    </div>
                                )
                            })}
                        </div>
                    </TabsContent>

                    {categories.map(category => {
                        const filteredImages = galleryImages.filter(img => img.category === category);
                        return (
                        <TabsContent key={category} value={category} className="mt-8">
                             <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                                {filteredImages.map(image => {
                                    const imageData = PlaceHolderImages.find(p => p.id === image.id);
                                    if (!imageData) return null;
                                    return (
                                        <div key={image.id} className="break-inside-avoid">
                                            <Image src={imageData.imageUrl} alt={imageData.description} width={500} height={500} className="w-full h-auto rounded-[2rem] shadow-md" data-ai-hint={imageData.imageHint} placeholder="blur" blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="/>
                                        </div>
                                    )
                                })}
                            </div>
                        </TabsContent>
                        )
                    })}
                </Tabs>
                </div>
            </section>
        </div>
    );
}
