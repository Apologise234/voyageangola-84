import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Star, MessageCircle, User, Calendar, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Review {
  id: string;
  rating: number;
  comment: string;
  is_verified: boolean;
  created_at: string;
  profiles: {
    full_name: string;
  };
}

interface ReviewsSectionProps {
  businessId: string;
}

const ReviewsSection = ({ businessId }: ReviewsSectionProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [canReview, setCanReview] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      
      if (session?.user) {
        // Check if user has completed reservations and can review
        const { data: completedReservations } = await supabase
          .from('reservations')
          .select('id')
          .eq('user_id', session.user.id)
          .eq('business_id', businessId)
          .eq('status', 'completed');
        
        setCanReview(completedReservations && completedReservations.length > 0);
      }
    };
    
    checkUser();
    fetchReviews();
  }, [businessId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          is_verified,
          created_at,
          user_id
        `)
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Get user profiles separately
      const reviewsWithProfiles = await Promise.all(
        (data || []).map(async (review) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', review.user_id)
            .single();
          
          return {
            ...review,
            profiles: profile || { full_name: 'Usuário Anônimo' }
          };
        })
      );
      
      setReviews(reviewsWithProfiles);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para avaliar.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get a completed reservation to link the review
      const { data: reservation } = await supabase
        .from('reservations')
        .select('id')
        .eq('user_id', user.id)
        .eq('business_id', businessId)
        .eq('status', 'completed')
        .limit(1)
        .single();

      const { error } = await supabase
        .from('reviews')
        .insert([{
          user_id: user.id,
          business_id: businessId,
          reservation_id: reservation?.id,
          rating: newReview.rating,
          comment: newReview.comment,
          is_verified: !!reservation
        }]);

      if (error) throw error;

      toast({
        title: "Avaliação enviada!",
        description: "Obrigado por compartilhar sua experiência.",
      });

      setReviewDialogOpen(false);
      setNewReview({ rating: 5, comment: '' });
      fetchReviews();
    } catch (error: any) {
      toast({
        title: "Erro ao enviar avaliação",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
          />
        ))}
      </div>
    );
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  if (loading) {
    return <div className="animate-pulse bg-muted h-32 rounded-lg"></div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Avaliações ({reviews.length})
          </div>
          <div className="flex items-center gap-2">
            {renderStars(Math.round(parseFloat(averageRating)))}
            <span className="text-sm text-muted-foreground">
              {averageRating}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {user && canReview && (
          <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                Avaliar Estabelecimento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Deixe sua avaliação</DialogTitle>
                <DialogDescription>
                  Compartilhe sua experiência para ajudar outros visitantes
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nota</label>
                  {renderStars(newReview.rating, true, (rating) => 
                    setNewReview({...newReview, rating})
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium">Comentário</label>
                  <Textarea
                    placeholder="Conte-nos sobre sua experiência..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmitReview}>
                  Enviar Avaliação
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {reviews.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Ainda não há avaliações para este estabelecimento.
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {review.profiles?.full_name || 'Usuário Anônimo'}
                    </span>
                    {review.is_verified && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {renderStars(review.rating)}
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(review.created_at), "dd 'de' MMM", { locale: ptBR })}
                    </span>
                  </div>
                </div>
                {review.comment && (
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewsSection;