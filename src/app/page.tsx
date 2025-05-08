import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Sparkles, Users, Briefcase, Clock, Award, Zap } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <Sparkles className="w-8 h-8 text-blue-500" />,
      title: "AI-Powered Templates",
      description: "Receive personalized template recommendations based on your career level and industry for maximum impact.",
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-green-500" />,
      title: "Smart Bullet Points",
      description: "Generate powerful job descriptions tailored for ATS systems to increase your chances of getting noticed.",
    },
    {
      icon: <Zap className="w-8 h-8 text-amber-500" />,
      title: "Real-Time Customization",
      description: "Edit and preview your resume instantly with our intuitive drag-and-drop interface.",
    },
    {
      icon: <Users className="w-8 h-8 text-indigo-500" />,
      title: "AI Mock Interview",
      description: "Practice with personalized interview questions based on your resume and receive real-time feedback.",
    },
    {
      icon: <Briefcase className="w-8 h-8 text-purple-500" />,
      title: "One-Click Job Matching",
      description: "Discover relevant job opportunities that align with your skills and experience.",
    },
    {
      icon: <Clock className="w-8 h-8 text-rose-500" />,
      title: "Application Tracker",
      description: "Keep track of all your job applications, interviews, and follow-ups in one place.",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-32 md:pt-32 md:pb-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white dark:from-slate-950 dark:to-background opacity-80" />

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12 md:mb-20">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pb-2 mb-6">
              Create Stunning Resumes with AI Power
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Build professional, ATS-optimized resumes in minutes.
              Let AI suggest powerful bullet points, match you with jobs, and prepare you for interviews.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/resume-builder">
                  Create Your Resume <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/templates">
                  View Templates
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto max-w-5xl bg-white dark:bg-slate-900 rounded-lg shadow-xl overflow-hidden">
            <div className="aspect-[16/9] bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-950 dark:to-purple-950 flex items-center justify-center">
              <div className="p-4 sm:p-8 w-full bg-card shadow-lg rounded-lg max-w-3xl mx-auto">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Resume Preview</h3>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="hidden sm:block w-28 h-28 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex-shrink-0" />
                    <div className="flex-1 space-y-4">
                      <div className="h-8 w-60 bg-muted rounded" />
                      <div className="h-4 w-40 bg-muted rounded" />
                      <div className="h-4 w-full bg-muted rounded" />
                      <div className="h-4 w-full bg-muted rounded" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-5 w-32 bg-muted rounded" />
                    <div className="h-4 w-full bg-muted rounded" />
                    <div className="h-4 w-full bg-muted rounded" />
                    <div className="h-4 w-3/4 bg-muted rounded" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-5 w-32 bg-muted rounded" />
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-8 bg-muted rounded" />
                      <div className="h-8 bg-muted rounded" />
                      <div className="h-8 bg-muted rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-4 right-4 bg-primary text-primary-foreground px-3 py-1 text-sm rounded-full font-medium">
              <span className="flex items-center gap-1">
                <Sparkles className="h-4 w-4" /> AI Enhanced
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features for Career Success
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered tools help you craft the perfect resume, prepare for interviews, and land your dream job.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-background rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create your professional resume in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Enter Your Information</h3>
              <p className="text-muted-foreground">
                Fill in your details or import from LinkedIn to get started quickly
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-purple-600 dark:text-purple-400">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Customize with AI</h3>
              <p className="text-muted-foreground">
                Let AI enhance your bullet points and recommend the best templates
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-green-600 dark:text-green-400">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Download & Apply</h3>
              <p className="text-muted-foreground">
                Export in multiple formats and start applying to matching jobs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Thousands of professionals have boosted their careers with our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-background p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 mr-4"></div>
                <div>
                  <h4 className="font-semibold">Sarah K.</h4>
                  <p className="text-sm text-muted-foreground">Marketing Manager</p>
                </div>
              </div>
              <p className="italic">
                "The AI bullet point suggestions were incredible. I received interview calls from 3 companies within a week of updating my resume!"
              </p>
              <div className="flex mt-4">
                <Award className="h-5 w-5 text-amber-500" />
                <Award className="h-5 w-5 text-amber-500" />
                <Award className="h-5 w-5 text-amber-500" />
                <Award className="h-5 w-5 text-amber-500" />
                <Award className="h-5 w-5 text-amber-500" />
              </div>
            </div>

            <div className="bg-background p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 mr-4"></div>
                <div>
                  <h4 className="font-semibold">Michael T.</h4>
                  <p className="text-sm text-muted-foreground">Software Engineer</p>
                </div>
              </div>
              <p className="italic">
                "The mock interview feature helped me prepare for tough technical questions. I landed my dream job at a major tech company!"
              </p>
              <div className="flex mt-4">
                <Award className="h-5 w-5 text-amber-500" />
                <Award className="h-5 w-5 text-amber-500" />
                <Award className="h-5 w-5 text-amber-500" />
                <Award className="h-5 w-5 text-amber-500" />
                <Award className="h-5 w-5 text-amber-500" />
              </div>
            </div>

            <div className="bg-background p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 mr-4"></div>
                <div>
                  <h4 className="font-semibold">Jessica M.</h4>
                  <p className="text-sm text-muted-foreground">Healthcare Professional</p>
                </div>
              </div>
              <p className="italic">
                "The application tracker saved me so much time. I could focus on preparing for interviews instead of trying to remember where I applied."
              </p>
              <div className="flex mt-4">
                <Award className="h-5 w-5 text-amber-500" />
                <Award className="h-5 w-5 text-amber-500" />
                <Award className="h-5 w-5 text-amber-500" />
                <Award className="h-5 w-5 text-amber-500" />
                <Award className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Accelerate Your Career?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have transformed their job search with our AI-powered tools.
          </p>
          <Button size="lg" variant="secondary" asChild className="text-primary">
            <Link href="/resume-builder">
              Start Building Your Resume <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
