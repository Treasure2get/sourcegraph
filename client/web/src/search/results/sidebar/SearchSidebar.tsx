import classNames from 'classnames'
import React, { useCallback, useMemo } from 'react'
import { useHistory } from 'react-router'
import StickyBox from 'react-sticky-box'

import { Filter } from '@sourcegraph/shared/src/search/stream'
import { VersionContextProps } from '@sourcegraph/shared/src/search/util'
import { SettingsCascadeProps } from '@sourcegraph/shared/src/settings/settings'
import { TelemetryProps } from '@sourcegraph/shared/src/telemetry/telemetryService'

import { CaseSensitivityProps, PatternTypeProps, SearchContextProps } from '../..'
import { AuthenticatedUser } from '../../../auth'
import { FeatureFlagProps } from '../../../featureFlags/featureFlags'
import { TemporarySettings } from '../../../settings/temporary/TemporarySettings'
import { useTemporarySetting } from '../../../settings/temporary/useTemporarySetting'
import { QueryState, submitSearch, toggleSearchFilter } from '../../helpers'

import { getDynamicFilterLinks, getRepoFilterLinks, getSearchSnippetLinks } from './FilterLink'
import { getQuickLinks } from './QuickLink'
import { getSearchReferenceFactory } from './SearchReference'
import styles from './SearchSidebar.module.scss'
import { SearchSidebarSection } from './SearchSidebarSection'
import { getSearchTypeLinks } from './SearchTypeLink'

export interface SearchSidebarProps
    extends Omit<PatternTypeProps, 'setPatternType'>,
        Omit<CaseSensitivityProps, 'setCaseSensitivity'>,
        VersionContextProps,
        Pick<SearchContextProps, 'selectedSearchContextSpec'>,
        SettingsCascadeProps,
        TelemetryProps,
        FeatureFlagProps {
    authenticatedUser: AuthenticatedUser | null
    query: string
    filters?: Filter[]
    className?: string
    navbarSearchQueryState: QueryState
    onNavbarQueryChange: (queryState: QueryState) => void
    isSourcegraphDotCom: boolean
}

export enum SectionID {
    SEARCH_REFERENCE = 'reference',
    SEARCH_TYPES = 'types',
    DYNAMIC_FILTERS = 'filters',
    REPOSITORIES = 'repositories',
    SEARCH_SNIPPETS = 'snippets',
    QUICK_LINKS = 'quicklinks',
}

export const SearchSidebar: React.FunctionComponent<SearchSidebarProps> = props => {
    const history = useHistory()
    const [collapsedSections, setCollapsedSections] = useTemporarySetting('search.collapsedSidebarSections')

    const onFilterClicked = useCallback(
        (value: string) => {
            const newQuery = toggleSearchFilter(props.query, value)
            submitSearch({ ...props, query: newQuery, source: 'filter', history })
        },
        [history, props]
    )

    const onDynamicFilterClicked = useCallback(
        (value: string) => {
            props.telemetryService.log('DynamicFilterClicked', {
                search_filter: { value },
            })

            onFilterClicked(value)
        },
        [onFilterClicked, props.telemetryService]
    )

    const onSnippetClicked = useCallback(
        (value: string) => {
            props.telemetryService.log('SearchSnippetClicked')
            onFilterClicked(value)
        },
        [onFilterClicked, props.telemetryService]
    )

    const persistToggleState = useCallback(
        (id: SectionID, open: boolean) => {
            setCollapsedSections(openSections => {
                const newSettings: TemporarySettings['search.collapsedSidebarSections'] = {
                    ...openSections,
                    [id]: open,
                }
                return newSettings
            })
        },
        [setCollapsedSections]
    )
    const onSearchReferenceToggle = useCallback(
        open => {
            persistToggleState(SectionID.SEARCH_REFERENCE, open)
            props.telemetryService.log(open ? 'SearchReferenceOpened' : 'SearchReferenceClosed')
        },
        [persistToggleState, props.telemetryService]
    )

    const repoFilterLinks = useMemo(() => getRepoFilterLinks(props.filters, onDynamicFilterClicked), [
        props.filters,
        onDynamicFilterClicked,
    ])

    let body

    // collapsedSections is undefined on first render. To prevent the sections
    // being rendered open and immediately closing them, we render them only after
    // we got the settings.
    if (collapsedSections) {
        body = (
            <StickyBox className={styles.searchSidebarStickyBox}>
                <SearchSidebarSection
                    className={styles.searchSidebarItem}
                    header="Search Types"
                    startCollapsed={collapsedSections?.[SectionID.SEARCH_TYPES]}
                    onToggle={open => persistToggleState(SectionID.SEARCH_TYPES, open)}
                >
                    {getSearchTypeLinks(props)}
                </SearchSidebarSection>
                <SearchSidebarSection
                    className={styles.searchSidebarItem}
                    header="Search reference"
                    showSearch={true}
                    startCollapsed={collapsedSections?.[SectionID.SEARCH_REFERENCE]}
                    onToggle={onSearchReferenceToggle}
                >
                    {getSearchReferenceFactory(props)}
                </SearchSidebarSection>
                <SearchSidebarSection
                    className={styles.searchSidebarItem}
                    header="Dynamic filters"
                    startCollapsed={collapsedSections?.[SectionID.DYNAMIC_FILTERS]}
                    onToggle={open => persistToggleState(SectionID.DYNAMIC_FILTERS, open)}
                >
                    {getDynamicFilterLinks(props.filters, onDynamicFilterClicked)}
                </SearchSidebarSection>
                <SearchSidebarSection
                    className={styles.searchSidebarItem}
                    header="Repositories"
                    startCollapsed={collapsedSections?.[SectionID.REPOSITORIES]}
                    onToggle={open => persistToggleState(SectionID.REPOSITORIES, open)}
                    showSearch={true}
                    noResultText={
                        <span>
                            None of the top {repoFilterLinks.length} repositories in your results match this filter. Try
                            a <code>repo:</code> search in the main search bar instead.
                        </span>
                    }
                >
                    {repoFilterLinks}
                </SearchSidebarSection>
                <SearchSidebarSection
                    className={styles.searchSidebarItem}
                    header="Search snippets"
                    startCollapsed={collapsedSections?.[SectionID.SEARCH_SNIPPETS]}
                    onToggle={open => persistToggleState(SectionID.SEARCH_SNIPPETS, open)}
                >
                    {getSearchSnippetLinks(props.settingsCascade, onSnippetClicked)}
                </SearchSidebarSection>
                <SearchSidebarSection
                    className={styles.searchSidebarItem}
                    header="Quicklinks"
                    startCollapsed={collapsedSections?.[SectionID.QUICK_LINKS]}
                    onToggle={open => persistToggleState(SectionID.QUICK_LINKS, open)}
                >
                    {getQuickLinks(props.settingsCascade)}
                </SearchSidebarSection>
            </StickyBox>
        )
    }

    return <div className={classNames(styles.searchSidebar, props.className)}>{body}</div>
}
