import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PenSquare, Plus, X, Save, Eye } from 'lucide-react';
import { blogAPI, BlogPost } from '@/api/api';
import { useToast } from '@/hooks/use-toast';

const NewPost = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    tags: [] as string[],
  });
  const [currentTag, setCurrentTag] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem('authToken');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto px-4">
          <PenSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-6">
            You need to be logged in to create a new post.
          </p>
          <Button onClick={() => navigate('/login')}>
            Sign In to Continue
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.body.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in the title and content fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const newPost: Omit<BlogPost, 'id'> = {
        title: formData.title,
        body: formData.body,
        userId: 1, // Demo user ID
        author: localStorage.getItem('userName') || 'Anonymous',
        createdAt: new Date().toISOString(),
        readTime: `${Math.ceil(formData.body.split(' ').length / 200)} min read`,
        tags: formData.tags,
      };

      await blogAPI.createPost(newPost);
      
      toast({
        title: 'Success!',
        description: 'Your post has been published successfully.',
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to publish post. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const wordCount = formData.body.split(' ').filter(word => word.length > 0).length;
  const readTime = Math.ceil(wordCount / 200);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <PenSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Create New Post</h1>
                <p className="text-muted-foreground">Share your thoughts with the community</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsPreview(!isPreview)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {isPreview ? 'Edit' : 'Preview'}
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {isPreview ? (
            /* Preview Mode */
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  This is how your post will appear to readers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-4">
                    {formData.title || 'Untitled Post'}
                  </h1>
                  
                  {/* Meta Info */}
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-6">
                    <span>By {localStorage.getItem('userName') || 'Anonymous'}</span>
                    <span>•</span>
                    <span>{new Date().toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{readTime} min read</span>
                    <span>•</span>
                    <span>{wordCount} words</span>
                  </div>

                  {/* Tags */}
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Content */}
                  <div className="prose prose-lg max-w-none">
                    <div className="text-foreground leading-relaxed space-y-4">
                      {formData.body ? (
                        formData.body.split('\n').map((paragraph, index) => (
                          <p key={index} className={paragraph.trim() === '' ? 'h-4' : ''}>
                            {paragraph}
                          </p>
                        ))
                      ) : (
                        <p className="text-muted-foreground italic">
                          Your post content will appear here...
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Edit Mode */
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Post Content</CardTitle>
                      <CardDescription>
                        Write your post title and content
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          name="title"
                          placeholder="Enter an engaging title for your post..."
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="body">Content *</Label>
                        <Textarea
                          id="body"
                          name="body"
                          placeholder="Write your post content here. Share your insights, experiences, or knowledge..."
                          value={formData.body}
                          onChange={handleInputChange}
                          rows={20}
                          className="min-h-[400px] resize-y"
                          required
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{wordCount} words</span>
                          <span>{readTime} min read</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Tags */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Tags</CardTitle>
                      <CardDescription>
                        Add tags to help readers find your post
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Add a tag..."
                          value={currentTag}
                          onChange={(e) => setCurrentTag(e.target.value)}
                          onKeyPress={handleKeyPress}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleAddTag}
                          disabled={!currentTag.trim()}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="pr-1">
                              {tag}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-auto p-1 ml-1"
                                onClick={() => handleRemoveTag(tag)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Publish */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Publish</CardTitle>
                      <CardDescription>
                        Ready to share your post?
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-light"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Publishing...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Publish Post
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewPost;