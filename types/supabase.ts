export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          display_name: string | null
          avatar_url: string | null
          token_balance: number
          business_name: string | null
          business_description: string | null
          website_url: string | null
          instagram_handle: string | null
          industry: string | null
          target_audience: string | null
          brand_voice: string | null
          tone: string | null
          visual_style: string | null
          location: string | null
          primary_color: string | null
          secondary_color: string | null
          voice_sample: string | null
          goals: string | null
          desired_outcomes: string | null
          content_pillars: string[] | null
          subscription_tier: string | null
          subscription_status: string | null
          stripe_customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          display_name?: string | null
          avatar_url?: string | null
          token_balance?: number
          business_name?: string | null
          business_description?: string | null
          website_url?: string | null
          instagram_handle?: string | null
          industry?: string | null
          target_audience?: string | null
          brand_voice?: string | null
          tone?: string | null
          visual_style?: string | null
          location?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          voice_sample?: string | null
          goals?: string | null
          desired_outcomes?: string | null
          content_pillars?: string[] | null
          subscription_tier?: string | null
          subscription_status?: string | null
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          display_name?: string | null
          avatar_url?: string | null
          token_balance?: number
          business_name?: string | null
          business_description?: string | null
          website_url?: string | null
          instagram_handle?: string | null
          industry?: string | null
          target_audience?: string | null
          brand_voice?: string | null
          tone?: string | null
          visual_style?: string | null
          location?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          voice_sample?: string | null
          goals?: string | null
          desired_outcomes?: string | null
          content_pillars?: string[] | null
          subscription_tier?: string | null
          subscription_status?: string | null
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      content_plans: {
        Row: {
          id: string
          user_id: string
          month: string
          industry: string | null
          target_audience: string | null
          goals: string | null
          quality_mode: string | null
          quality_report: Json | null
          research_summary: Json | null
          brief_snapshot: Json | null
          generation_version: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          month: string
          industry?: string | null
          target_audience?: string | null
          goals?: string | null
          quality_mode?: string | null
          quality_report?: Json | null
          research_summary?: Json | null
          brief_snapshot?: Json | null
          generation_version?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          month?: string
          industry?: string | null
          target_audience?: string | null
          goals?: string | null
          quality_mode?: string | null
          quality_report?: Json | null
          research_summary?: Json | null
          brief_snapshot?: Json | null
          generation_version?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          plan_id: string | null
          date: string
          day_of_week: string | null
          format: string
          funnel_stage: string | null
          pillar: string | null
          topic: string | null
          caption_hook: string | null
          caption_body: string | null
          hashtags: string[] | null
          posting_time: string | null
          status: "draft" | "scheduled" | "published" | "failed"
          instagram_media_id: string | null
          instagram_permalink: string | null
          published_at: string | null
          meta: Json | null
          quality_score: number | null
          evidence_refs: Json | null
          primary_kpi: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id?: string | null
          date: string
          day_of_week?: string | null
          format: string
          funnel_stage?: string | null
          pillar?: string | null
          topic?: string | null
          caption_hook?: string | null
          caption_body?: string | null
          hashtags?: string[] | null
          posting_time?: string | null
          status?: "draft" | "scheduled" | "published" | "failed"
          instagram_media_id?: string | null
          instagram_permalink?: string | null
          published_at?: string | null
          meta?: Json | null
          quality_score?: number | null
          evidence_refs?: Json | null
          primary_kpi?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string | null
          date?: string
          day_of_week?: string | null
          format?: string
          funnel_stage?: string | null
          pillar?: string | null
          topic?: string | null
          caption_hook?: string | null
          caption_body?: string | null
          hashtags?: string[] | null
          posting_time?: string | null
          status?: "draft" | "scheduled" | "published" | "failed"
          instagram_media_id?: string | null
          instagram_permalink?: string | null
          published_at?: string | null
          meta?: Json | null
          quality_score?: number | null
          evidence_refs?: Json | null
          primary_kpi?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      generated_assets: {
        Row: {
          id: string
          user_id: string
          post_id: string | null
          asset_type: "image" | "carousel" | "video"
          url: string
          storage_path: string | null
          prompt: string | null
          meta: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id?: string | null
          asset_type: "image" | "carousel" | "video"
          url: string
          storage_path?: string | null
          prompt?: string | null
          meta?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string | null
          asset_type?: "image" | "carousel" | "video"
          url?: string
          storage_path?: string | null
          prompt?: string | null
          meta?: Json | null
          created_at?: string
        }
      }
      social_connections: {
        Row: {
          id: string
          user_id: string
          platform: "instagram"
          account_id: string | null
          access_token_encrypted: string
          refresh_token_encrypted: string | null
          token_expires_at: string | null
          connected_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          platform?: "instagram"
          account_id?: string | null
          access_token_encrypted: string
          refresh_token_encrypted?: string | null
          token_expires_at?: string | null
          connected_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          platform?: "instagram"
          account_id?: string | null
          access_token_encrypted?: string
          refresh_token_encrypted?: string | null
          token_expires_at?: string | null
          connected_at?: string
          updated_at?: string
        }
      }
      instagram_media_insights_daily: {
        Row: {
          id: string
          user_id: string
          post_id: string | null
          instagram_media_id: string
          metric_date: string
          impressions: number | null
          reach: number | null
          likes: number | null
          comments: number | null
          saves: number | null
          shares: number | null
          profile_visits: number | null
          follows: number | null
          engagement_rate: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id?: string | null
          instagram_media_id: string
          metric_date: string
          impressions?: number | null
          reach?: number | null
          likes?: number | null
          comments?: number | null
          saves?: number | null
          shares?: number | null
          profile_visits?: number | null
          follows?: number | null
          engagement_rate?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string | null
          instagram_media_id?: string
          metric_date?: string
          impressions?: number | null
          reach?: number | null
          likes?: number | null
          comments?: number | null
          saves?: number | null
          shares?: number | null
          profile_visits?: number | null
          follows?: number | null
          engagement_rate?: number | null
          created_at?: string
        }
      }
      benchmark_content_patterns: {
        Row: {
          id: string
          industry: string
          format: string | null
          funnel_stage: "TOFU" | "MOFU" | "BOFU" | null
          pillar: string | null
          hook_pattern: string | null
          cta_pattern: string | null
          posting_window: string | null
          source_handle: string | null
          source_reference: string | null
          sample_size: number | null
          metric_window_days: number | null
          reach_rate: number | null
          share_rate: number | null
          save_rate: number | null
          comment_rate: number | null
          profile_action_rate: number | null
          intent_comment_rate: number | null
          non_follower_ratio: number | null
          observed_lift: number | null
          tags: string[] | null
          collected_at: string | null
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          industry: string
          format?: string | null
          funnel_stage?: "TOFU" | "MOFU" | "BOFU" | null
          pillar?: string | null
          hook_pattern?: string | null
          cta_pattern?: string | null
          posting_window?: string | null
          source_handle?: string | null
          source_reference?: string | null
          sample_size?: number | null
          metric_window_days?: number | null
          reach_rate?: number | null
          share_rate?: number | null
          save_rate?: number | null
          comment_rate?: number | null
          profile_action_rate?: number | null
          intent_comment_rate?: number | null
          non_follower_ratio?: number | null
          observed_lift?: number | null
          tags?: string[] | null
          collected_at?: string | null
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          industry?: string
          format?: string | null
          funnel_stage?: "TOFU" | "MOFU" | "BOFU" | null
          pillar?: string | null
          hook_pattern?: string | null
          cta_pattern?: string | null
          posting_window?: string | null
          source_handle?: string | null
          source_reference?: string | null
          sample_size?: number | null
          metric_window_days?: number | null
          reach_rate?: number | null
          share_rate?: number | null
          save_rate?: number | null
          comment_rate?: number | null
          profile_action_rate?: number | null
          intent_comment_rate?: number | null
          non_follower_ratio?: number | null
          observed_lift?: number | null
          tags?: string[] | null
          collected_at?: string | null
          expires_at?: string | null
          created_at?: string
        }
      }
      planner_generation_logs: {
        Row: {
          id: string
          user_id: string
          month: string
          idempotency_key: string | null
          quality_mode: string
          attempt_count: number
          overall_score: number | null
          dimension_scores: Json | null
          latency_ms: number | null
          used_account_signals: boolean | null
          failure_reason: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          month: string
          idempotency_key?: string | null
          quality_mode: string
          attempt_count?: number
          overall_score?: number | null
          dimension_scores?: Json | null
          latency_ms?: number | null
          used_account_signals?: boolean | null
          failure_reason?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          month?: string
          idempotency_key?: string | null
          quality_mode?: string
          attempt_count?: number
          overall_score?: number | null
          dimension_scores?: Json | null
          latency_ms?: number | null
          used_account_signals?: boolean | null
          failure_reason?: string | null
          created_at?: string
        }
      }
      token_balances: {
        Row: {
          user_id: string
          balance: number
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          user_id: string
          balance?: number
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          user_id?: string
          balance?: number
          created_at?: string | null
          updated_at?: string | null
        }
      }
      token_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          type: string
          description: string | null
          stripe_session_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          type: string
          description?: string | null
          stripe_session_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          type?: string
          description?: string | null
          stripe_session_id?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      debit_tokens: {
        Args: {
          p_user_id: string
          p_amount: number
          p_type: string
          p_description: string
        }
        Returns: number
      }
      credit_tokens: {
        Args: {
          p_user_id: string
          p_amount: number
          p_type: string
          p_description: string
          p_stripe_session_id?: string | null
        }
        Returns: number
      }
      create_content_plan_with_posts: {
        Args: {
          p_user_id: string
          p_plan_json: Json
          p_posts_json: Json
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
