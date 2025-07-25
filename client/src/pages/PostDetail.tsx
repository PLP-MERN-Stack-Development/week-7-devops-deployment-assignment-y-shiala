import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CommentSection from '@/components/CommentSection';
import { ArrowLeft, Calendar, Clock, Eye, Heart, Share2, Bookmark } from 'lucide-react';
import { BlogPost, blogAPI } from '@/api/api';
import { useToast } from '@/hooks/use-toast';

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      loadPost(parseInt(id));
    }
  }, [id]);

  useEffect(() => {
    if (post) {
      // Simulate random like count
      setLikeCount(Math.floor(Math.random() * 100) + 10);
      
      // Check if post is liked/bookmarked (from localStorage)
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
      const bookmarkedPosts = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');
      
      setIsLiked(likedPosts.includes(post.id));
      setIsBookmarked(bookmarkedPosts.includes(post.id));
    }
  }, [post]);

  const loadPost = async (postId: number) => {
    try {
      setLoading(true);
      const postData = await blogAPI.getPost(postId);
      setPost(postData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load post. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    if (!post) return;

    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
    
    if (isLiked) {
      const updatedLikes = likedPosts.filter((id: number) => id !== post.id);
      localStorage.setItem('likedPosts', JSON.stringify(updatedLikes));
      setLikeCount(prev => prev - 1);
      setIsLiked(false);
      toast({
        title: 'Like removed',
        description: 'Post removed from your likes.',
      });
    } else {
      likedPosts.push(post.id);
      localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
      setLikeCount(prev => prev + 1);
      setIsLiked(true);
      toast({
        title: 'Post liked!',
        description: 'Added to your liked posts.',
      });
    }
  };

  const handleBookmark = () => {
    if (!post) return;

    const bookmarkedPosts = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');
    
    if (isBookmarked) {
      const updatedBookmarks = bookmarkedPosts.filter((id: number) => id !== post.id);
      localStorage.setItem('bookmarkedPosts', JSON.stringify(updatedBookmarks));
      setIsBookmarked(false);
      toast({
        title: 'Bookmark removed',
        description: 'Post removed from your bookmarks.',
      });
    } else {
      bookmarkedPosts.push(post.id);
      localStorage.setItem('bookmarkedPosts', JSON.stringify(bookmarkedPosts));
      setIsBookmarked(true);
      toast({
        title: 'Post bookmarked!',
        description: 'Added to your bookmarks.',
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.body.substring(0, 100) + '...',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied!',
        description: 'Post link copied to clipboard.',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="mb-6">
              <div className="h-4 bg-muted rounded w-24 mb-4"></div>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="h-8 bg-muted rounded w-3/4 mb-6"></div>
              <div className="flex items-center space-x-4 mb-8">
                <div className="h-12 w-12 bg-muted rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/3"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Post not found</h1>
          <p className="text-muted-foreground mb-6">The post you're looking for doesn't exist.</p>
          <Link to="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="hover:bg-muted">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to posts
            </Button>
          </Link>
        </div>

        {/* Post Content */}
        <article className="max-w-4xl mx-auto">
          {/* Post Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Author Info */}
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {post.author?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{post.author}</p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{post.createdAt ? formatDate(post.createdAt) : 'Recently'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{post.readTime || '5 min read'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{Math.floor(Math.random() * 1000) + 100} views</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLike}
                  className={isLiked ? 'text-red-500 border-red-500' : ''}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                  {likeCount}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBookmark}
                  className={isBookmarked ? 'text-accent border-accent' : ''}
                >
                  <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="bg-muted hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </header>

          {/* Post Body */}
          <div className="prose prose-lg max-w-none mb-12">
            <div className="text-foreground leading-relaxed space-y-6">
              {post.body.split('\n').map((paragraph, index) => (
                <p key={index} className="text-base leading-7">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Comments Section */}
          <CommentSection postId={post.id} />
        </article>
      </div>
    </div>
  );
};

export default PostDetail;