"use client"

import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"

type CarouselContextType = {
  embla: ReturnType<typeof useEmblaCarousel>[1]
}

const CarouselContext = React.createContext<CarouselContextType | null>(null)

export function Carousel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const [emblaRef, embla] = useEmblaCarousel()

  return (
    <CarouselContext.Provider value={{ embla }}>
      {/* ✅ Added relative here */}
      <div className={`relative ${className ?? ""}`}>
        <div ref={emblaRef} className="overflow-hidden">
          {children}
        </div>
      </div>
    </CarouselContext.Provider>
  )
}

export function CarouselContent({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="flex">{children}</div>
}

export function CarouselItem({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-w-full">{children}</div>
}

export function CarouselPrevious() {
  const context = React.useContext(CarouselContext)
  if (!context) return null

  return (
    <button
      onClick={() => context.embla?.scrollPrev()}
      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow"
    >
      <ChevronLeft size={20} />
    </button>
  )
}

export function CarouselNext() {
  const context = React.useContext(CarouselContext)
  if (!context) return null

  return (
    <button
      onClick={() => context.embla?.scrollNext()}
      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow"
    >
      <ChevronRight size={20} />
    </button>
  )
}



