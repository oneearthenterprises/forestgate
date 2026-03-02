import Image from 'next/image';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { detailedExperiences } from '@/app/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { MountainViewIcon } from '@/components/icons/MountainViewIcon';
import { RiverViewIcon } from '@/components/icons/RiverViewIcon';
import { AdventureIcon } from '@/components/icons/AdventureIcon';
import { FamilyFriendlyIcon } from '@/components/icons/FamilyFriendlyIcon';
import { PetFriendlyIcon } from '@/components/icons/PetFriendlyIcon';
import { StargazingIcon } from '@/components/icons/StargazingIcon';
import { BirdwatchingIcon } from '@/components/icons/BirdwatchingIcon';
import { LawnsIcon } from '@/components/icons/LawnsIcon';

const icons = {
    'mountain-view': MountainViewIcon,
    'river-view': RiverViewIcon,
    'adventure': AdventureIcon,
    'family': FamilyFriendlyIcon,
    'pet': PetFriendlyIcon,
    'stargazing': StargazingIcon,
    'birdwatching': BirdwatchingIcon,
    'lawns': LawnsIcon,
};

export default function ExperiencesPage() {
    const headerImage = PlaceHolderImages.find((img) => img.id === 'exp-trekking');
    
    return (
        <div>
            {headerImage && (
                <PageHeader
                title="Experiences & Activities"
                subtitle="Embrace adventure, find tranquility, and create lasting memories."
                imageUrl={headerImage.imageUrl}
                imageHint={headerImage.imageHint}
                />
            )}

            <section>
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                        {detailedExperiences.map((exp) => {
                            const expImage = PlaceHolderImages.find(img => img.id === exp.image);
                            const Icon = icons[exp.iconName] || MountainViewIcon;
                            return (
                                <Card key={exp.title} className="flex flex-col group overflow-hidden transition-shadow hover:shadow-xl">
                                    {expImage && (
                                        <div className="relative aspect-video overflow-hidden">
                                            <Image
                                                src={expImage.imageUrl}
                                                alt={exp.title}
                                                fill
                                                className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                                                data-ai-hint={expImage.imageHint}
                                                placeholder="blur"
                                                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
                                            />
                                        </div>
                                    )}
                                    <CardHeader className="flex-row items-center gap-4">
                                        <Icon className="w-10 h-10 text-primary shrink-0" />
                                        <CardTitle className="font-headline text-2xl">{exp.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <p className="text-foreground/80">{exp.description}</p>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}
