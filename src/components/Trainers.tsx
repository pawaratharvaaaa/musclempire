import { motion } from "framer-motion";
import { FaInstagram, FaTwitter, FaFacebookF } from "react-icons/fa";

import trainer1 from "@/assets/images/trainer-1.png";
import trainer2 from "@/assets/images/trainer-2.png";
import trainer3 from "@/assets/images/trainer-3.png";
import trainer4 from "@/assets/images/trainer-4.png";

const trainers = [
  {
    name: "Vikram Singh",
    role: "Head Strength Coach",
    image: trainer1,
    socials: { ig: "#", tw: "#", fb: "#" }
  },
  {
    name: "Aisha Patel",
    role: "HIIT & Core Specialist",
    image: trainer2,
    socials: { ig: "#", tw: "#", fb: "#" }
  },
  {
    name: "Rahul Desai",
    role: "MMA & Combat Trainer",
    image: trainer3,
    socials: { ig: "#", tw: "#", fb: "#" }
  },
  {
    name: "Neha Sharma",
    role: "CrossFit & Mobility",
    image: trainer4,
    socials: { ig: "#", tw: "#", fb: "#" }
  }
];

export default function Trainers() {
  return (
    <section id="trainers" className="py-24 bg-background relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-primary font-bold uppercase tracking-[0.2em] mb-4 text-sm flex items-center gap-2">
              <span className="w-8 h-px bg-primary inline-block"></span>
              Elite Roster
            </h2>
            <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
              Meet The <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Architects</span>
            </h3>
          </div>
          <p className="text-muted-foreground max-w-sm text-right md:text-left">
            They've built champions. Now they're here to build you. Mumbai's most demanding and results-driven coaching staff.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trainers.map((trainer, idx) => (
            <motion.div 
              key={idx}
              className="group relative aspect-[3/4] overflow-hidden bg-card border border-border"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
            >
              <div className="absolute inset-0 bg-black/40 z-10 group-hover:bg-black/20 transition-colors duration-500" />
              
              <img 
                src={trainer.image} 
                alt={trainer.name} 
                className="w-full h-full object-cover object-center filter md:grayscale md:group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
              />
              
              {/* Overlay Content */}
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 group-hover:opacity-100 transition-opacity">
                
                {/* Socials - Slide up on hover */}
                <motion.div 
                  className="flex gap-3 mb-4 overflow-hidden"
                  initial={false}
                >
                  <motion.a 
                    href={trainer.socials.ig} 
                    className="w-8 h-8 bg-white/10 hover:bg-primary hover:text-black rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-colors"
                    variants={{
                      rest: { y: 40, opacity: 0 },
                      hover: { y: 0, opacity: 1, transition: { delay: 0.1 } }
                    }}
                  >
                    <FaInstagram size={14} />
                  </motion.a>
                  <motion.a 
                    href={trainer.socials.tw} 
                    className="w-8 h-8 bg-white/10 hover:bg-primary hover:text-black rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-colors"
                    variants={{
                      rest: { y: 40, opacity: 0 },
                      hover: { y: 0, opacity: 1, transition: { delay: 0.15 } }
                    }}
                  >
                    <FaTwitter size={14} />
                  </motion.a>
                  <motion.a 
                    href={trainer.socials.fb} 
                    className="w-8 h-8 bg-white/10 hover:bg-primary hover:text-black rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-colors"
                    variants={{
                      rest: { y: 40, opacity: 0 },
                      hover: { y: 0, opacity: 1, transition: { delay: 0.2 } }
                    }}
                  >
                    <FaFacebookF size={14} />
                  </motion.a>
                </motion.div>
                
                <div>
                  <h4 className="text-xl font-bold uppercase tracking-wide text-white mb-1">{trainer.name}</h4>
                  <p className="text-primary text-sm font-medium uppercase tracking-wider">{trainer.role}</p>
                </div>
              </div>

              {/* invisible hover trigger for framer motion variants */}
              <motion.div 
                className="absolute inset-0 z-30"
                initial="rest"
                whileHover="hover"
                animate="rest"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
