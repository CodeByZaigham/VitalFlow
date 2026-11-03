import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { BloodType } from '../../types';
import { bloodCompatibility, donationFacts } from '../../utils/mockData';
import { Heart, Info, ArrowRight, Lightbulb } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const bloodTypes: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-lg bg-gradient-to-br from-red-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Info className="mr-2 h-7 w-7 text-red-500" />
              About Blood Donation
            </CardTitle>
            <CardDescription>
              Learn about blood compatibility and donation facts
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="mr-2 h-6 w-6 text-red-500" />
              Blood Compatibility Chart
            </CardTitle>
            <CardDescription>
              Understanding which blood types can donate to or receive from each other
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg mb-4 flex items-center">
                  Can Donate To
                  <ArrowRight className="ml-2 h-4 w-4 text-gray-400" />
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bloodTypes.map((bloodType, index) => (
                    <motion.div
                      key={`donate-${bloodType}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="p-4 bg-gradient-to-r from-red-50 to-white rounded-lg border border-red-100 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="border-red-300 text-red-700 text-base px-3 py-1">
                          {bloodType}
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {bloodCompatibility.canDonateTo[bloodType].map((type) => (
                          <Badge key={type} variant="secondary" className="bg-red-100 text-red-800">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg mb-4 flex items-center">
                  Can Receive From
                  <ArrowRight className="ml-2 h-4 w-4 text-gray-400" />
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bloodTypes.map((bloodType, index) => (
                    <motion.div
                      key={`receive-${bloodType}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="p-4 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="border-blue-300 text-blue-700 text-base px-3 py-1">
                          {bloodType}
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {bloodCompatibility.canReceiveFrom[bloodType].map((type) => (
                          <Badge key={type} variant="secondary" className="bg-blue-100 text-blue-800">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="space-y-2 text-sm text-yellow-800">
                    <p className="font-semibold">Important Notes:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li><strong>O-</strong> is the universal donor - can donate to all blood types</li>
                      <li><strong>AB+</strong> is the universal recipient - can receive from all blood types</li>
                      <li>Rh+ can receive from both Rh+ and Rh-, but Rh- can only receive from Rh-</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="mr-2 h-6 w-6 text-yellow-500" />
              Blood Donation Facts
            </CardTitle>
            <CardDescription>
              Important information about blood donation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {donationFacts.map((fact, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-4 bg-gradient-to-br from-purple-50 to-white rounded-lg border border-purple-100 hover:shadow-md transition-all hover:border-purple-200"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center mr-3 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{fact}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="shadow-lg bg-gradient-to-br from-green-50 to-white border-green-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Heart className="h-16 w-16 text-red-500 mx-auto" />
              <h3 className="text-2xl">Be a Hero, Donate Blood</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Your single blood donation can save up to three lives. Join our community of heroes
                and make a difference today. Every drop counts!
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
