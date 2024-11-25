'use client'

import { useQuery } from '@apollo/client'
import { ChevronRight, Flame, Home, Plus, SearchIcon } from 'lucide-react'
import Link from 'next/link'
import { Session } from 'next-auth'

import { CreateCommunityModal } from '@/components/modals/CreateCommunityModal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/Collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/Sidebar'
import { siteConfig } from '@/config/site'
import { CommunitiesDocument } from '@/graphql/__generated__/operations'

const items = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
  },
  {
    title: 'Discover',
    url: '/discover',
    icon: SearchIcon,
  },
]

interface AppSidebarProps {
  session: Session | null
}

export function AppSidebar({ session }: AppSidebarProps) {
  const { data: communitiesData } = useQuery(CommunitiesDocument, {
    variables: {
      filter: {
        membershipType: 'MEMBER',
      },
    },
  })

  return (
    <Sidebar>
      <SidebarHeader className='flex flex-row flex-nowrap items-center justify-start gap-1'>
        <Flame className='h-6 w-6 fill-orange-600 stroke-orange-600 stroke-[3px]' />
        <span className='text-2xl font-semibold'>
          <Link href='/'>{siteConfig.name}</Link>
        </span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        {session && (
          <>
            <Collapsible key={'communities'} defaultOpen>
              <SidebarGroup>
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger>
                    <span>Communities</span>
                    <ChevronRight className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90' />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <Plus />
                          <CreateCommunityModal />
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      {communitiesData?.communities?.communities.map((community) => (
                        <SidebarMenuItem key={community.id}>
                          <Link href={`/b/${community.name}`}>
                            <SidebarMenuButton>
                              <Avatar className='h-8 w-8'>
                                <AvatarImage src={community.iconUrl ?? undefined} />
                                <AvatarFallback className='bg-primary-foreground text-sm'>
                                  b/
                                </AvatarFallback>
                              </Avatar>
                              <span className='truncate text-sm'>{`b/${community.name}`}</span>
                            </SidebarMenuButton>
                          </Link>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
            <SidebarSeparator />
          </>
        )}
      </SidebarContent>
    </Sidebar>
  )
}
