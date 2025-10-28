import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';

export const ResourceUploader = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [module, setModule] = useState('');
  const [type, setType] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const { createResource } = useData();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      let resourceUrl = url;
      if (type === 'pdf' && file) {
        resourceUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
      }

      await createResource({
        title,
        description,
        module,
        type,
        url: resourceUrl,
        uploadedBy: user.username,
      });

      toast({
        title: 'Resource uploaded!',
        description: 'Your resource has been added successfully.',
      });

      // Reset form
      setTitle('');
      setDescription('');
      setModule('');
      setType('');
      setUrl('');
      setFile(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload resource. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="paper-shadow">
      <CardHeader>
        <CardTitle className="font-serif flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload New Resource
        </CardTitle>
        <CardDescription>
          Add a new learning resource for your students
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Resource Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g., Introduction to Topic"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="module">Module/Week</Label>
              <Input
                id="module"
                value={module}
                onChange={(e) => setModule(e.target.value)}
                required
                placeholder="e.g., Week 1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Resource Type</Label>
              <Select value={type} onValueChange={setType} required>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="link">External Link</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {type === 'pdf' ? (
              <div className="space-y-2">
                <Label htmlFor="file">PDF File</Label>
                <Input
                  id="file"
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  required
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="url">Resource URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  placeholder="https://..."
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a brief description of the resource..."
              rows={3}
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Upload Resource
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
