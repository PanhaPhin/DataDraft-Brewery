
import React from 'react'
import { Card, CardContent } from '../ui/card'

const DashboardSkeleton = () => {
    return (
        <div className="space-y-6">
        
            <div className="space-y-2">
                <div className="h-8 w-1/4 bg-gray-200 animate-pulse rounded-lg" />
                <div className="h-4 w-1/3 bg-gray-100 animate-pulse rounded" />
            </div>

    
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, index) => (
                    <Card
                        key={index}
                        className="bg-white/95 shadow-lg rounded-xl border border-gray-100"
                    >
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                {/* Text Skeleton */}
                                <div className="space-y-3 flex-1">
                                    <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />

                                    <div className="h-8 w-32 bg-gray-200 animate-pulse rounded-lg" />

                                    <div className="h-3 w-20 bg-gray-100 animate-pulse rounded" />
                                </div>

                                {/* Icon Skeleton */}
                                <div className="h-12 w-12 bg-gray-200 animate-pulse rounded-xl" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Skeleton */}
                <Card className="lg:col-span-2 bg-white/95 shadow-lg rounded-xl border border-gray-100">
                    <CardContent className="p-6">
                        <div className="space-y-5">
                            <div className="h-6 w-40 bg-gray-200 animate-pulse rounded-lg" />

                            <div className="h-[280px] w-full bg-gray-100 animate-pulse rounded-xl" />
                        </div>
                    </CardContent>
                </Card>

                {/* Activity Skeleton */}
                <Card className="bg-white/95 shadow-lg rounded-xl border border-gray-100">
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            <div className="h-6 w-32 bg-gray-200 animate-pulse rounded-lg" />

                            {[...Array(4)].map((_, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3"
                                >
                                    <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full" />

                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 w-3/4 bg-gray-200 animate-pulse rounded" />
                                        <div className="h-3 w-1/2 bg-gray-100 animate-pulse rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Table Skeleton */}
            <Card className="bg-white/95 shadow-lg rounded-xl border border-gray-100">
                <CardContent className="p-6">
                    <div className="space-y-5">
                        <div className="flex items-center justify-between">
                            <div className="h-6 w-40 bg-gray-200 animate-pulse rounded-lg" />
                            <div className="h-9 w-24 bg-gray-100 animate-pulse rounded-lg" />
                        </div>

                        <div className="space-y-4">
                            {[...Array(5)].map((_, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-4 border-b border-gray-100 pb-4"
                                >
                                    <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full" />

                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-1/3 bg-gray-200 animate-pulse rounded" />
                                        <div className="h-3 w-1/4 bg-gray-100 animate-pulse rounded" />
                                    </div>

                                    <div className="h-8 w-20 bg-gray-100 animate-pulse rounded-lg" />
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default DashboardSkeleton

