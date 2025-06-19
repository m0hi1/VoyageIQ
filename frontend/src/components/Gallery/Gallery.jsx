import React, { useState, useEffect, useCallback, useMemo } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Modal from "react-modal";
import {
  Search,
  Heart,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Filter,
  Grid,
  List,
  Camera,
  MapPin,
  Calendar,
  Users,
  Star
} from "lucide-react";
import Img01 from "../../assets/images/hero-img01.jpg";
import Img02 from "../../assets/images/hero-img02.jpg";
import Img03 from "../../assets/images/front-02.jpg";
import Img04 from "../../assets/images/gallery-04.jpg";
import Img06 from "../../assets/images/gallery-03.jpg";
import Img07 from "../../assets/images/gallery-08.jpg";
import Img08 from "../../assets/images/gallery-02.jpg";
import Img09 from "../../assets/images/gallery-01.jpg";

const ImagesGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("masonry");
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imageRotation, setImageRotation] = useState(0);
  const [showImageInfo, setShowImageInfo] = useState(false);

  // Enhanced image data with metadata
  const imageData = useMemo(() => [
    {
      src: Img01,
      title: "Mountain Adventure",
      description: "Breathtaking mountain peaks and pristine wilderness",
      category: "mountains",
      location: "Himalayas, Nepal",
      photographer: "Adventure Team",
      date: "2024-03-15",
      rating: 4.8,
      tags: ["mountains", "adventure", "hiking", "nature"]
    },
    {
      src: Img02,
      title: "Ocean Paradise",
      description: "Crystal clear waters and pristine beaches",
      category: "beaches",
      location: "Maldives",
      photographer: "Travel Explorer",
      date: "2024-02-20",
      rating: 4.9,
      tags: ["beach", "ocean", "tropical", "relaxation"]
    },
    {
      src: Img03,
      title: "Cultural Heritage",
      description: "Ancient architecture and rich cultural heritage",
      category: "culture",
      location: "Rajasthan, India",
      photographer: "Heritage Photographer",
      date: "2024-01-10",
      rating: 4.7,
      tags: ["culture", "heritage", "architecture", "history"]
    },
    {
      src: Img06,
      title: "Desert Expedition",
      description: "Golden sand dunes and magical sunsets",
      category: "desert",
      location: "Sahara, Morocco",
      photographer: "Desert Guide",
      date: "2024-04-05",
      rating: 4.6,
      tags: ["desert", "adventure", "sunset", "dunes"]
    },
    {
      src: Img04,
      title: "Forest Adventure",
      description: "Lush green forests and wildlife encounters",
      category: "nature",
      location: "Amazon Rainforest",
      photographer: "Nature Lover",
      date: "2024-03-28",
      rating: 4.8,
      tags: ["forest", "wildlife", "nature", "adventure"]
    },
    {
      src: Img07,
      title: "City Lights",
      description: "Vibrant city life and stunning skylines",
      category: "urban",
      location: "Tokyo, Japan",
      photographer: "City Explorer",
      date: "2024-02-14",
      rating: 4.5,
      tags: ["city", "urban", "nightlife", "modern"]
    },
    {
      src: Img08,
      title: "Winter Wonderland",
      description: "Snow-covered landscapes and winter sports",
      category: "winter",
      location: "Swiss Alps",
      photographer: "Winter Photographer",
      date: "2024-01-25",
      rating: 4.9,
      tags: ["winter", "snow", "skiing", "mountains"]
    },
    {
      src: Img09,
      title: "Tropical Escape",
      description: "Exotic islands and tropical adventures",
      category: "tropical",
      location: "Bali, Indonesia",
      photographer: "Tropical Explorer",
      date: "2024-04-12",
      rating: 4.7,
      tags: ["tropical", "island", "paradise", "beach"]
    }
  ], []);

  const categories = useMemo(() => [
    { id: "all", name: "All Photos", count: imageData.length },
    { id: "mountains", name: "Mountains", count: imageData.filter(img => img.category === "mountains").length },
    { id: "beaches", name: "Beaches", count: imageData.filter(img => img.category === "beaches").length },
    { id: "culture", name: "Culture", count: imageData.filter(img => img.category === "culture").length },
    { id: "desert", name: "Desert", count: imageData.filter(img => img.category === "desert").length },
    { id: "nature", name: "Nature", count: imageData.filter(img => img.category === "nature").length },
    { id: "urban", name: "Urban", count: imageData.filter(img => img.category === "urban").length },
    { id: "winter", name: "Winter", count: imageData.filter(img => img.category === "winter").length },
    { id: "tropical", name: "Tropical", count: imageData.filter(img => img.category === "tropical").length }
  ], [imageData]);

  // Filter images based on search and category
  const filteredImages = useMemo(() => {
    return imageData.filter(image => {
      const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === "all" || image.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [imageData, searchTerm, selectedCategory]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // Simple loading simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Modal navigation functions
  const openModal = useCallback((index) => {
    setSelectedImage(index);
    setZoomLevel(1);
    setImageRotation(0);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedImage(null);
    setZoomLevel(1);
    setImageRotation(0);
    setShowImageInfo(false);
  }, []);

  const navigateImage = useCallback((direction) => {
    if (selectedImage === null) return;

    const newIndex = direction === 'next'
      ? (selectedImage + 1) % filteredImages.length
      : selectedImage === 0 ? filteredImages.length - 1 : selectedImage - 1;

    setSelectedImage(newIndex);
    setZoomLevel(1);
    setImageRotation(0);
  }, [selectedImage, filteredImages.length]);

  // Image interaction functions
  const toggleFavorite = useCallback((index) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(index)) {
        newFavorites.delete(index);
      } else {
        newFavorites.add(index);
      }
      return newFavorites;
    });
  }, []);

  const downloadImage = useCallback((imageSrc, title) => {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = `${title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const handleZoom = useCallback((type) => {
    if (type === 'in' && zoomLevel < 3) {
      setZoomLevel(prev => prev + 0.25);
    } else if (type === 'out' && zoomLevel > 0.5) {
      setZoomLevel(prev => prev - 0.25);
    } else if (type === 'reset') {
      setZoomLevel(1);
      setImageRotation(0);
    }
  }, [zoomLevel]);

  const handleRotate = useCallback(() => {
    setImageRotation(prev => (prev + 90) % 360);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (selectedImage === null) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          navigateImage('prev');
          break;
        case 'ArrowRight':
          e.preventDefault();
          navigateImage('next');
          break;
        case 'Escape':
          e.preventDefault();
          closeModal();
          break;
        case '+':
        case '=':
          e.preventDefault();
          handleZoom('in');
          break;
        case '-':
          e.preventDefault();
          handleZoom('out');
          break;
        case 'r':
          e.preventDefault();
          handleRotate();
          break;
        case 'i':
          e.preventDefault();
          setShowImageInfo(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedImage, navigateImage, closeModal, handleZoom, handleRotate]);

  // Search and filter component
  const SearchAndFilter = () => (
    <div className="mb-8 space-y-4">
      {/* Search Bar */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by title, location, or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-BaseColor focus:border-transparent transition-all duration-200 bg-white shadow-sm"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === category.id
              ? 'bg-BaseColor text-white shadow-lg transform scale-105'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
              }`}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>

      {/* View Mode Toggle */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setViewMode('masonry')}
          className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'masonry'
            ? 'bg-BaseColor text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          title="Masonry View"
        >
          <Grid className="w-5 h-5" />
        </button>
        <button
          onClick={() => setViewMode('grid')}
          className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'grid'
            ? 'bg-BaseColor text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          title="Grid View"
        >
          <List className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  // Simple Image Card Component
  const ImageCard = ({ image, index, onClick }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
      <div className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white">
        <div className="relative overflow-hidden">
          {/* Simple loading placeholder */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-BaseColor rounded-full animate-spin"></div>
            </div>
          )}

          <img
            src={image.src}
            alt={image.title}
            className={`w-full h-auto object-cover transition-all duration-300 group-hover:scale-105 cursor-pointer ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => onClick(index)}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />

          {/* Simple overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(index);
              }}
              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${favorites.has(index)
                ? 'bg-red-500 text-white'
                : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              title="Add to Favorites"
            >
              <Heart className={`w-4 h-4 ${favorites.has(index) ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                downloadImage(image.src, image.title);
              }}
              className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-all duration-200"
              title="Download Image"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>

          {/* Image info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="font-semibold text-lg mb-1">{image.title}</h3>
            <p className="text-sm opacity-90 mb-2 line-clamp-2">{image.description}</p>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{image.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-current text-yellow-400" />
                <span>{image.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Grid View Component
  const GridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredImages.map((image, index) => (
        <ImageCard
          key={index}
          image={image}
          index={index}
          onClick={openModal}
        />
      ))}
    </div>
  );

  // Masonry View Component
  const MasonryView = () => (
    <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 768: 2, 992: 3, 1200: 4 }}>
      <Masonry gutter="1.5rem">
        {filteredImages.map((image, index) => (
          <ImageCard
            key={index}
            image={image}
            index={index}
            onClick={openModal}
          />
        ))}
      </Masonry>
    </ResponsiveMasonry>
  );

  // Enhanced Modal Component
  const EnhancedModal = () => {
    if (selectedImage === null) return null;

    const currentImage = filteredImages[selectedImage];

    return (
      <Modal
        isOpen={selectedImage !== null}
        onRequestClose={closeModal}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black/90 backdrop-blur-sm"
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
      >
        <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-all duration-200"
            title="Close (Esc)"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Buttons */}
          {filteredImages.length > 1 && (
            <>
              <button
                onClick={() => navigateImage('prev')}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-all duration-200"
                title="Previous (←)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => navigateImage('next')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-all duration-200"
                title="Next (→)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image Controls */}
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <button
              onClick={() => handleZoom('out')}
              disabled={zoomLevel <= 0.5}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleZoom('in')}
              disabled={zoomLevel >= 3}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={handleRotate}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-all duration-200"
              title="Rotate (R)"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleZoom('reset')}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-all duration-200"
              title="Reset View"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>

          {/* Image Info Toggle */}
          <button
            onClick={() => setShowImageInfo(!showImageInfo)}
            className="absolute bottom-4 left-4 z-10 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-all duration-200"
            title="Toggle Info (I)"
          >
            <Filter className="w-5 h-5" />
          </button>

          {/* Main Image */}
          <div className="relative max-w-full max-h-full overflow-hidden rounded-lg">
            <img
              src={currentImage.src}
              alt={currentImage.title}
              className="max-w-full max-h-full object-contain transition-all duration-300"
              style={{
                transform: `scale(${zoomLevel}) rotate(${imageRotation}deg)`,
                transformOrigin: 'center'
              }}
            />
          </div>

          {/* Image Information Panel */}
          {showImageInfo && (
            <div className="absolute bottom-4 right-4 z-10 bg-white/95 backdrop-blur-sm rounded-lg p-4 max-w-sm text-gray-900">
              <h3 className="font-bold text-lg mb-2">{currentImage.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{currentImage.description}</p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-BaseColor" />
                  <span>{currentImage.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-BaseColor" />
                  <span>{currentImage.photographer}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-BaseColor" />
                  <span>{new Date(currentImage.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span>{currentImage.rating}/5.0</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex flex-wrap gap-1">
                  {currentImage.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-BaseColor/10 text-BaseColor text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => toggleFavorite(selectedImage)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all duration-200 ${favorites.has(selectedImage)
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  <Heart className={`w-4 h-4 ${favorites.has(selectedImage) ? 'fill-current' : ''}`} />
                  <span className="text-xs">
                    {favorites.has(selectedImage) ? 'Favorited' : 'Favorite'}
                  </span>
                </button>
                <button
                  onClick={() => downloadImage(currentImage.src, currentImage.title)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-BaseColor text-white rounded-lg hover:bg-BaseColor/90 transition-all duration-200"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-xs">Download</span>
                </button>
              </div>
            </div>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-white/10 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
            {selectedImage + 1} / {filteredImages.length}
          </div>
        </div>
      </Modal>
    );
  };

  // No Results Component
  const NoResults = () => (
    <div className="text-center py-12">
      <div className="max-w-md mx-auto">
        <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Images Found</h3>
        <p className="text-gray-500 mb-4">
          {searchTerm ?
            `No images match "${searchTerm}" in the ${selectedCategory === 'all' ? 'gallery' : selectedCategory + ' category'}.` :
            `No images in the ${selectedCategory} category.`
          }
        </p>
        <button
          onClick={() => {
            setSearchTerm("");
            setSelectedCategory("all");
          }}
          className="px-4 py-2 bg-BaseColor text-white rounded-lg hover:bg-BaseColor/90 transition-colors duration-200"
        >
          Show All Images
        </button>
      </div>
    </div>
  );

  // Simple Loading Component
  const LoadingGallery = () => {
    const SkeletonCard = ({ index }) => {
      const heights = ['h-64', 'h-80', 'h-72', 'h-96'];
      const randomHeight = heights[index % heights.length];

      return (
        <div className={`${randomHeight} bg-gray-200 rounded-xl overflow-hidden relative`}>
          {/* Simple shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>

          {/* Simple content placeholder */}
          <div className="p-4 h-full flex flex-col justify-between">
            <div className="flex-1"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-8">
        {/* Simple loading spinner */}
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-BaseColor rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading gallery...</p>
        </div>

        {/* Skeleton grid */}
        {viewMode === 'masonry' ? (
          <ResponsiveMasonry
            columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1200: 4 }}
          >
            <Masonry gutter="24px">
              {[...Array(8)].map((_, index) => (
                <SkeletonCard key={index} index={index} />
              ))}
            </Masonry>
          </ResponsiveMasonry>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <SkeletonCard key={index} index={index} />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Main Render
  return (
    <div className="w-full">
      <SearchAndFilter />

      {loading ? (
        <LoadingGallery />
      ) : filteredImages.length === 0 ? (
        <NoResults />
      ) : (
        <div className="animate-fadeIn">
          {viewMode === 'masonry' ? <MasonryView /> : <GridView />}
        </div>
      )}

      <EnhancedModal />

      {/* Gallery Stats */}
      {!loading && filteredImages.length > 0 && (
        <div className="mt-8 text-center text-gray-600">
          <p className="text-sm">
            Showing {filteredImages.length} of {imageData.length} images
            {favorites.size > 0 && (
              <span className="ml-2 inline-flex items-center">
                • <Heart className="w-3 h-3 text-red-500 mx-1" /> {favorites.size} favorited
              </span>
            )}
          </p>
        </div>
      )}

      {/* Keyboard Shortcuts Info */}
      {selectedImage !== null && (
        <div className="fixed bottom-4 right-4 z-40 bg-black/80 text-white text-xs p-3 rounded-lg backdrop-blur-sm">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>← → Navigate</div>
            <div>ESC Close</div>
            <div>+ - Zoom</div>
            <div>R Rotate</div>
            <div>I Info</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagesGallery;
