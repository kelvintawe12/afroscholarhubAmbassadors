import React from 'react'
import { useLocation } from 'react-router-dom'
import { ConstructionIcon as LucideConstructionIcon } from 'lucide-react'
export const PlaceholderPage = ({ title }: { title?: string }) => {
  const location = useLocation()
  const pathSegments = location.pathname.split('/')
  const lastSegment = pathSegments[pathSegments.length - 1]
  const pageName = title || lastSegment.replace(/-/g, ' ')
  return (
    <div className="flex h-full flex-col items-center justify-center py-16 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-ash-teal/10">
        <LucideConstructionIcon size={40} className="text-ash-teal" />
      </div>
      <h1 className="mb-2 text-2xl font-bold text-gray-900">
        {pageName.charAt(0).toUpperCase() + pageName.slice(1)} Page
      </h1>
      <p className="mb-8 max-w-md text-gray-500">
        This page is under construction. Our team is working hard to make it
        available soon.
      </p>
      <div className="w-full max-w-md rounded-lg bg-ash-teal/5 p-4">
        <h2 className="mb-2 font-medium text-ash-teal">What to expect:</h2>
        <ul className="list-inside list-disc text-left text-sm text-gray-700">
          <li>Comprehensive data visualization</li>
          <li>Intuitive user interface</li>
          <li>Advanced filtering and search capabilities</li>
          <li>Integration with other ASH Nexus features</li>
        </ul>
      </div>
    </div>
  )
}
const ConstructionIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="6" width="20" height="8" rx="1" />
    <path d="M17 14v7" />
    <path d="M7 14v7" />
    <path d="M17 3v3" />
    <path d="M7 3v3" />
    <path d="M10 14 2.3 6.3" />
    <path d="m14 6 7.7 7.7" />
    <path d="m8 6 8 8" />
  </svg>
)
