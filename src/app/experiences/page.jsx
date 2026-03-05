import Image from 'next/image';
import { PageHeader } from '@/components/shared/PageHeader';
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
        <div className="bg-[#fcfcfc]">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-stretch">
                        {detailedExperiences.map((exp) => {
                            const expImage = PlaceHolderImages.find(img => img.id === exp.image);
                            const Icon = icons[exp.iconName] || MountainViewIcon;
                            
                            return (
                                <div 
                                    key={exp.title} 
                                    className="relative group overflow-hidden rounded-[2.5rem] bg-card h-[550px] shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-border/50"
                                >
                                    {/* Background Image */}
                                    {expImage && (
                                        <Image
                                            src={expImage.imageUrl}
                                            alt={exp.title}
                                            fill
                                            className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                                            data-ai-hint={expImage.imageHint}
                                            placeholder="blur"
                                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
                                        />
                                    )}

                                    {/* Premium Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b2c3d] via-[#0b2c3d]/40 to-transparent opacity-90 transition-opacity duration-500" />
                                    
                                    {/* Decorative Icon Badge */}
                                    <div className="absolute top-8 left-8">
                                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 text-white group-hover:bg-[#fcb101] group-hover:border-[#fcb101] group-hover:text-black transition-all duration-500 shadow-xl">
                                            <Icon className="w-8 h-8" />
                                        </div>
                                    </div>

                                    {/* Content Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-10">
                                        <h3 className="font-headline text-4xl font-bold text-white mb-4 leading-tight tracking-tight drop-shadow-md">
                                            {exp.title}
                                        </h3>
                                        
                                        <div className="overflow-hidden">
                                            <p className="text-white/90 text-base leading-relaxed line-clamp-6 font-light">
                                                {exp.description}
                                            </p>
                                        </div>

                                        {/* Stylized Accent Bar */}
                                        <div className="w-16 h-1 bg-[#fcb101] mt-8 rounded-full shadow-sm" />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}
