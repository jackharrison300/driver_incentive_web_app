export interface EbaySearchResponseData {
    href: string
    total: number
    next: string
    limit: number
    offset: number
    itemSummaries: EbayItemSummary[]
  }

  export interface EbayItemSummary {
    itemId: string
    title: string
    itemGroupHref?: string
    leafCategoryIds: string[]
    categories: Category[]
    price: Price
    itemGroupType?: string
    itemHref: string
    seller: Seller
    condition: string
    conditionId: string
    shippingOptions: ShippingOption[]
    buyingOptions: string[]
    itemWebUrl: string
    itemLocation: ItemLocation
    adultOnly: boolean
    legacyItemId: string
    availableCoupons: boolean
    itemCreationDate: string
    topRatedBuyingExperience: boolean
    priorityListing: boolean
    listingMarketplaceId: string
    additionalImages?: AdditionalImage[]
    image?: Image
    thumbnailImages?: ThumbnailImage[]
  }
  
  export interface Category {
    categoryId: string
    categoryName: string
  }
  
  export interface Price {
    value: string
    currency: string
  }
  
  export interface Seller {
    username: string
    feedbackPercentage: string
    feedbackScore: number
  }
  
  export interface ShippingOption {
    shippingCostType: string
    shippingCost: ShippingCost
  }
  
  export interface ShippingCost {
    value: string
    currency: string
  }
  
  export interface ItemLocation {
    postalCode?: string
    country: string
  }
  
  export interface AdditionalImage {
    imageUrl: string
  }
  
  export interface Image {
    imageUrl: string
  }
  
  export interface ThumbnailImage {
    imageUrl: string
  }
  