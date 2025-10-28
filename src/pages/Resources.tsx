import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { ResourceCard } from '@/components/ResourceCard';
import { ResourceUploader } from '@/components/ResourceUploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function Resources() {
  const { isTeacher } = useAuth();
  const { resources, loading } = useData();
  const [selectedModule, setSelectedModule] = useState<string>('all');

  const modules = ['all', ...new Set(resources.map((r) => r.module))];
  const filteredResources =
    selectedModule === 'all'
      ? resources
      : resources.filter((r) => r.module === selectedModule);

  return (
    <div className="min-h-screen bg-background">
      <main id="main-content" className="container mx-auto max-w-[1200px] px-6 py-20">
        <motion.div {...fadeIn}>
          <h1 className="font-serif text-4xl md:text-5xl mb-4">Learning Resources</h1>
          <p className="text-lg text-muted-foreground mb-12">
            {isTeacher
              ? 'Manage course materials and track engagement'
              : 'Access course materials and track your progress'}
          </p>
        </motion.div>

        {isTeacher && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12"
          >
            <ResourceUploader />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: isTeacher ? 0.2 : 0.1 }}
        >
          <Tabs value={selectedModule} onValueChange={setSelectedModule}>
            <TabsList className="mb-8">
              {modules.map((module) => (
                <TabsTrigger key={module} value={module} className="capitalize">
                  {module}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedModule}>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-64" />
                  ))}
                </div>
              ) : filteredResources.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">
                    No resources available in this module yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredResources.map((resource, index) => (
                    <motion.div
                      key={resource.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      <ResourceCard resource={resource} showProgress />
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}
