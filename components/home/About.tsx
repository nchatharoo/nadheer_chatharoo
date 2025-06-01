"use client";

import { motion } from "framer-motion";
import { fadeIn, slideUp } from "@/lib/animations";
import { Card, CardContent } from "@/components/ui/card";
import { Code, Layers, Lightbulb, LineChart, Smartphone, Users } from "lucide-react";

const skills = [
  {
    title: "Swift & SwiftUI",
    description: "Expert in building modern, declarative user interfaces with Swift and SwiftUI.",
    icon: <Code className="h-6 w-6" />,
  },
  {
    title: "UIKit & Core Animation",
    description: "Deep knowledge of UIKit and Core Animation for creating custom UI components and animations.",
    icon: <Layers className="h-6 w-6" />,
  },
  {
    title: "Performance Optimization",
    description: "Specializing in creating smooth, responsive applications that perform well on all devices.",
    icon: <LineChart className="h-6 w-6" />,
  },
  {
    title: "User Experience Design",
    description: "Crafting intuitive and delightful user experiences that follow Apple's design guidelines.",
    icon: <Users className="h-6 w-6" />,
  },
  {
    title: "Native Frameworks",
    description: "Experienced with Core Data, AVFoundation, Core Audio, Core Graphics, and other iOS frameworks.",
    icon: <Smartphone className="h-6 w-6" />,
  },
  {
    title: "App Architecture",
    description: "Building maintainable applications using MVVM, Clean Architecture, and other design patterns.",
    icon: <Lightbulb className="h-6 w-6" />,
  },
];

export default function About() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn()}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            variants={slideUp(0.1)}
          >
            About Me
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground"
            variants={slideUp(0.2)}
          >
            With over 8 years of experience in iOS development, I specialize in creating 
            beautiful, performant applications that delight users and solve real problems.
            My focus is on writing clean, maintainable code that follows best practices and 
            leverages the latest Apple technologies.
          </motion.p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skills.map((skill, index) => (
            <motion.div
              key={skill.title}
              variants={fadeIn(0.2 + index * 0.1)}
            >
              <Card className="h-full transition-all hover:shadow-md hover:translate-y-[-2px]">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary">
                      {skill.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{skill.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{skill.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}