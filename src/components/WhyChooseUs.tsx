import { HorizontalDepthFade } from "@/components/ui/horizontal-depth-fade";

export const FEATURES = [
  {
    src: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
    alt: 'Expert Trainers',
    title: 'Expert Trainers',
    description: 'Certified professionals dedicated to your success.',
  },
  {
    src: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&q=80',
    alt: 'Personalised Plans',
    title: 'Personalised Plans',
    description: 'Designed specifically for your unique body and goals.',
  },
  {
    src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
    alt: 'Modern Equipment',
    title: 'Modern Equipment',
    description: 'State-of-the-art machines for optimal performance.',
  },
  {
    src: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&q=80',
    alt: 'Strong Community',
    title: 'Strong Community',
    description: 'Train alongside a motivating fitness family.',
  },
  {
    src: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=600&q=80',
    alt: 'Flexible Timings',
    title: 'Flexible Timings',
    description: 'Adapting seamlessly to your demanding lifestyle.',
  },
  {
    src: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80',
    alt: 'Group Classes',
    title: 'Group Classes',
    description: 'High-energy sessions to push your limits together.',
  },
  {
    src: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80',
    alt: 'Recovery Zone',
    title: 'Recovery Zone',
    description: 'Dedicated spaces to heal, stretch, and recover.',
  },
  {
    src: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80',
    alt: 'Nutrition Bar',
    title: 'Nutrition Bar',
    description: 'Fuel up with premium supplements and fresh smoothies.',
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="bg-white pt-28 pb-28 relative">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      <div className="max-w-7xl mx-auto px-5 md:px-8 mb-16 relative z-10">
        <div className="text-center max-w-xl mx-auto">
          <div className="eyebrow justify-center mb-4 text-black border-black/10 bg-black/5">The Empire Advantage</div>
          <h2 className="font-display font-black text-black text-[clamp(2.5rem,5vw,3.5rem)] leading-none mb-6">
            Why Train <br/>
            <span className="text-gold-gradient">With Us</span>
          </h2>
          <p className="text-black/60 text-lg leading-relaxed">
            Explore the premium features that set Muscle Empire apart from the rest.
          </p>
        </div>
      </div>
      
      <HorizontalDepthFade
        images={FEATURES}
        itemWidth={400}
        itemHeight={560}
        gap="2rem"
        className="z-10"
      />
    </section>
  );
}
