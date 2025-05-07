"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "../../components/ui/dialog"
import type { ReviewImageResponse } from "../../types/review"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

interface ReviewImageGalleryProps {
    images: ReviewImageResponse[]
}

export function ReviewImageGallery({ images }: ReviewImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<number | null>(null)

    const openLightbox = (index: number) => {
        setSelectedImage(index)
    }

    const closeLightbox = () => {
        setSelectedImage(null)
    }

    const goToPrevious = () => {
        if (selectedImage !== null) {
            setSelectedImage((selectedImage - 1 + images.length) % images.length)
        }
    }

    const goToNext = () => {
        if (selectedImage !== null) {
            setSelectedImage((selectedImage + 1) % images.length)
        }
    }

    if (images.length === 0) return null

    return (
        <>
            <div className="flex flex-wrap gap-2 mt-3">
                {images.map((image, index) => (
                    <div key={image.id} className="cursor-pointer" onClick={() => openLightbox(index)}>
                        <img
                            src={image.imageUrl || "/placeholder.svg"}
                            alt={`Review image ${index + 1}`}
                            className="h-16 w-16 object-cover rounded-md border border-gray-200 hover:border-green-500 transition-colors"
                        />
                    </div>
                ))}
            </div>

            <Dialog open={selectedImage !== null} onOpenChange={closeLightbox}>
                <DialogContent className="sm:max-w-[800px] p-0 bg-transparent border-none shadow-none">
                    <div className="relative">
                        <button
                            onClick={closeLightbox}
                            className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        {selectedImage !== null && (
                            <img
                                src={images[selectedImage].imageUrl || "/placeholder.svg"}
                                alt={`Review image ${selectedImage + 1}`}
                                className="max-h-[80vh] max-w-full object-contain rounded-md"
                            />
                        )}

                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={goToPrevious}
                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-colors"
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </button>
                                <button
                                    onClick={goToNext}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-colors"
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </button>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
