import { Duration } from 'date-fns'

// Backend based settings lives in main settings.schema.json file so we can use generated types
// from these settings and insight schema json definitions.
import {
    BackendInsight as SearchBasedBackendInsightSettings,
    BackendInsightSeries as SearchBasedInsightSeries,
    InsightFilters as SearchBasedBackendFilters,
} from '../../../../schema/settings.schema'

import { InsightType, InsightTypePrefix, SyntheticInsightFields } from './common'

/**
 * Search based insight supports two types of configuration
 *
 * Extension based works via insight extension and lives in settings file on top level
 * search "searchInsights.insight.<name>": {...config}
 *
 * Backend based works on BE and lives in "insights.allrepos": { "searchInsights.insight.<name>" : { ...config }}
 */
export type SearchBasedInsight = SearchExtensionBasedInsight | SearchBackendBasedInsight

/**
 * Union type of all possible insight configurations (extension or backend based).
 * We have to have this separation in insight config since be and extension insight configs
 * are not the same.
 */
export type SearchBasedInsightConfiguration = SearchBasedExtensionInsightSettings | SearchBasedBackendInsightSettings

export interface SearchExtensionBasedInsight extends SearchBasedExtensionInsightSettings, SyntheticInsightFields {
    type: InsightType.Extension
}

/**
 * See public API of search insight extension
 * https://github.com/sourcegraph/sourcegraph-search-insights/blob/master/package.json#L26
 */
export interface SearchBasedExtensionInsightSettings {
    title: string
    repositories: string[]
    series: SearchBasedInsightSeries[]
    step: Duration
}

export type { SearchBasedBackendInsightSettings }

/**
 * Backend version of search based insight.
 */
export interface SearchBackendBasedInsight extends SearchBasedBackendInsightSettings, SyntheticInsightFields {
    type: InsightType.Backend
}

/**
 * Re-export import of Insights series type. This type was generated by json schema definition.
 * Re-export here for consistency. All insights (extension and backend based) should have the
 * same insight series type.
 *
 * Note: In the same time extensions also have this type in their public API
 * Search based insight extension - https://github.com/sourcegraph/sourcegraph-search-insights/blob/1b204a579160bab4208a1266cf4ad6e735cdd774/package.json#L50
 */
export type { SearchBasedInsightSeries, SearchBasedBackendFilters }

/**
 * Since we use insight name conventions to distinguish between insight types.
 * Example id for the search based insight: "searchInsights.insight.myFirstSearchBasedInsight"
 */
export const isSearchBasedInsightId = (id: string): boolean => id.startsWith(InsightTypePrefix.search)
