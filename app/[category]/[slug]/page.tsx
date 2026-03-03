import { getArticleBySlug, getRelatedArticles, getArticles } from '@/lib/actions/article-actions';
import { getVideos } from '@/lib/actions/video-actions';
import { scrapeSchedules } from '@/lib/crawler/score-scraper';
import Header from '@/components/Header';
import SafeImage from '@/components/SafeImage';
import RightSidebar from '@/components/RightSidebar';
import RelatedArticles from '@/components/RelatedArticles';
import ShareButtons from '@/components/ShareButtons';
import AdSenseAd from '@/components/AdSenseAd';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { getSettings } from '@/lib/actions/settings-actions';
import { getCategorySlug } from '@/lib/helpers';
import ReadingProgressBar from '@/components/ReadingProgressBar';

interface Props {

    params: Promise<{ category: string; slug: string }>;
}

const SITE_URL = 'https://tinthethao24h.com';

/** Truncate a plain-text string at a word boundary to a maximum length */
function truncateAtWord(text: string, maxLen: number): string {
    if (text.length <= maxLen) return text;
    const trimmed = text.substring(0, maxLen);
    return trimmed.substring(0, trimmed.lastIndexOf(' ')) + '...';
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, category } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) return { title: 'Không tìm thấy bài viết' };

    const rawText = article.translatedContent.replace(/<[^>]*>/g, '').trim();
    const description = truncateAtWord(rawText, 155);
    const canonicalUrl = `${SITE_URL}/${category}/${slug}`;
    const publishedAt = new Date(article.createdAt).toISOString();
    const modifiedAt = article.updatedAt
        ? new Date(article.updatedAt).toISOString()
        : publishedAt;

    // Build news_keywords: category + site brand
    const newsKeywords = [article.category, 'bóng đá', 'thể thao', 'tinthethao24h'].join(', ');

    return {
        title: article.translatedTitle,
        description,
        // news_keywords (for Google News)
        other: { 'news_keywords': newsKeywords },
        alternates: {
            canonical: canonicalUrl,
            // hreflang per article, not homepage
            languages: { 'vi-VN': canonicalUrl },
        },
        openGraph: {
            type: 'article',
            url: canonicalUrl,
            locale: 'vi_VN',
            siteName: 'Tin Thể Thao 24h',
            title: article.translatedTitle,
            description,
            images: article.imageUrl
                ? [{ url: article.imageUrl, width: 1200, height: 630, alt: article.translatedTitle, type: 'image/jpeg' }]
                : [{ url: `${SITE_URL}/og-default.png`, width: 1200, height: 630 }],
            publishedTime: publishedAt,
            modifiedTime: modifiedAt,
            section: article.category,
            authors: [`${SITE_URL}/tac-gia`],
            tags: [article.category, 'bóng đá', 'thể thao'],
        },
        robots: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
        },

        twitter: {
            card: 'summary_large_image',
            title: article.translatedTitle,
            description,
            images: article.imageUrl ? [article.imageUrl] : [],
        },
    };
}

export default async function ArticleDetail({ params }: Props) {
    const { slug, category } = await params;

    const articlePromise = getArticleBySlug(slug);
    const matchesPromise = scrapeSchedules();
    const latestArticlesPromise = getArticles('published');
    const latestVideosPromise = getVideos(5);

    const [article, matches, latestArticlesRaw, latestVideos, settings] = await Promise.all([
        articlePromise,
        matchesPromise,
        latestArticlesPromise,
        latestVideosPromise,
        getSettings()
    ]);

    if (!article) {
        notFound();
    }

    const newsArticles = latestArticlesRaw.filter((art: any) => art.category !== 'Soi Kèo');
    const latestArticlesFormatted = newsArticles.map((art: any) => ({
        title: art.translatedTitle,
        category: art.category,
        slug: art.slug,
        image: art.imageUrl,
    }));

    const relatedArticles = await getRelatedArticles(article.category, slug);
    const plainDescription = article.translatedContent.replace(/<[^>]*>/g, '').trim();
    const wordCount = plainDescription.split(/\s+/).length;

    return (
        <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', paddingBottom: '4rem' }}>
            <Header />
            <ReadingProgressBar />


            {/* JSON-LD: NewsArticle + SpeakableSpecification */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "NewsArticle",
                    "headline": article.translatedTitle,
                    "description": truncateAtWord(plainDescription, 200),
                    "image": article.imageUrl
                        ? [{ "@type": "ImageObject", "url": article.imageUrl, "width": 1200, "height": 630 }]
                        : [],
                    "datePublished": new Date(article.createdAt).toISOString(),
                    "dateModified": article.updatedAt
                        ? new Date(article.updatedAt).toISOString()
                        : new Date(article.createdAt).toISOString(),
                    "wordCount": wordCount,
                    "inLanguage": "vi-VN",
                    "isAccessibleForFree": true,
                    "articleSection": article.category,
                    "author": [{
                        "@type": "Person",
                        "name": article.authorName || "Tin Thể Thao 24h",
                        "url": `${SITE_URL}/tac-gia`,
                        "jobTitle": article.authorRole || "Biên tập viên thể thao"
                    }],
                    "publisher": {
                        "@type": "Organization",
                        "name": "Tin Thể Thao 24h",
                        "logo": {
                            "@type": "ImageObject",
                            "url": `${SITE_URL}/logo.png`,
                            "width": 600,
                            "height": 60
                        }
                    },
                    "mainEntityOfPage": {
                        "@type": "WebPage",
                        "@id": `${SITE_URL}/${category}/${article.slug}`
                    },
                    "copyrightHolder": {
                        "@type": "Organization",
                        "name": "Tin Thể Thao 24h"
                    },
                    "speakable": {
                        "@type": "SpeakableSpecification",
                        "cssSelector": ["h1", ".article-summary", ".article-content"]
                    }

                })
            }} />

            {/* JSON-LD: BreadcrumbList */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": SITE_URL },
                        { "@type": "ListItem", "position": 2, "name": article.category, "item": `${SITE_URL}/${category}` },
                        { "@type": "ListItem", "position": 3, "name": article.translatedTitle, "item": `${SITE_URL}/${category}/${article.slug}` }
                    ]
                })
            }} />

            <div className="main-grid" style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
                <div className="left-content">
                    <article className="article-container" style={{ marginBottom: '2rem', padding: '2.5rem 2rem', backgroundColor: 'var(--card-bg)', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)', backdropFilter: 'blur(10px)' }}>

                        <nav style={{ fontSize: '0.85rem', color: 'var(--text-color)', opacity: 0.6, marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                            <Link href="/" style={{ color: 'inherit', textDecoration: 'none', whiteSpace: 'nowrap' }}>Trang chủ</Link>
                            <span>/</span>
                            <Link href={`/${category}`} style={{ color: 'inherit', textDecoration: 'none', whiteSpace: 'nowrap' }}>{article.category}</Link>
                        </nav>


                        <h1 style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '1.5rem', lineHeight: '1.25', color: '#000', letterSpacing: '-0.01em' }}>
                            {article.translatedTitle}
                        </h1>

                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem', fontSize: '0.9rem', color: 'var(--text-color)', opacity: 0.8, borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <img src={article.authorAvatar || "/author-avatar.png"} alt={article.authorName || 'Tin Thể Thao 24h'}
                                    width={40} height={40}
                                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-color)' }} />
                                <span style={{ fontWeight: '800', color: 'var(--text-color)', fontSize: '1rem' }}>{article.authorName || 'Tin Thể Thao 24h'}</span>
                            </div>

                            <span>•</span>
                            <time dateTime={article.createdAt}>
                                {new Date(article.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                            </time>
                        </div>


                        <SafeImage
                            src={article.imageUrl}
                            alt={article.translatedTitle}
                            wrapInFigure={true}
                            caption={`Ảnh: ${article.translatedTitle}`}
                            style={{ width: '100%', height: 'auto', display: 'block', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                        />

                        <div
                            className="article-content"
                            style={{ fontSize: '1.25rem', lineHeight: '1.9', color: '#111' }}
                            dangerouslySetInnerHTML={{ __html: article.translatedContent }}
                        />

                        {/* In-Article AdSense */}
                        {settings.adsenseEnabled && settings.adsensePublisherId && settings.adsenseSlotInArticle && (
                            <AdSenseAd
                                publisherId={settings.adsensePublisherId}
                                slotId={settings.adsenseSlotInArticle}
                                format="auto"
                                style={{ margin: '2rem 0' }}
                            />
                        )}

                        {/* Social Share Buttons */}
                        <ShareButtons
                            url={`${SITE_URL}/${category}/${article.slug}`}
                            title={article.translatedTitle}
                        />

                        {relatedArticles.length > 0 && (
                            <RelatedArticles articles={relatedArticles} />
                        )}
                    </article>
                </div>

                <div className="sticky-sidebar">
                    <RightSidebar
                        matches={matches}
                        latestArticles={latestArticlesFormatted}
                        latestVideos={latestVideos}
                        adsensePublisherId={settings.adsenseEnabled ? (settings.adsensePublisherId || '') : ''}
                        adsenseSlotSidebar={settings.adsenseEnabled ? (settings.adsenseSlotSidebar || '') : ''}
                    />
                </div>

            </div>
        </main>
    );
}
