import Link from 'next/link';
import { ArrowRight, Users, Target, ShoppingCart, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { ROUTES, APP_NAME } from '@/lib/constants';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Save Together, Achieve Together
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Join community groups to save for shared goals. When targets are met, 
              we purchase items and celebrate together!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={ROUTES.REGISTER}>
                <Button size="lg" variant="primary" className="bg-white text-blue-600 hover:bg-gray-100">
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href={ROUTES.GROUPS}>
                <Button size="lg" variant="ghost" className="text-white border-2 border-white hover:bg-white hover:text-blue-600">
                  Browse Groups
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How {APP_NAME} Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Four simple steps to reach your savings goals together
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                1. Create or Join
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Start a new savings group or join an existing one with friends or community members
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                2. Set a Goal
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Define your target amount and what you&apos;re saving for together
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-10 h-10 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                3. Contribute
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Everyone contributes to the pool at their own pace until the target is reached
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                4. Celebrate!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We purchase the item when the goal is met and everyone celebrates together
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose {APP_NAME}?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              The best way to save together for shared goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md transition-colors">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Transparent Progress
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Track contributions in real-time with visual progress bars and milestone celebrations
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md transition-colors">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Community Driven
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Save with friends, family, or community members towards common goals
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md transition-colors">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Secure & Reliable
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your contributions are safe and the purchase happens only when targets are met
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Saving Together?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of people already achieving their goals through community savings
          </p>
          <Link href={ROUTES.REGISTER}>
            <Button size="lg" variant="primary" className="bg-white text-blue-600 hover:bg-gray-100">
              Create Your Free Account
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
