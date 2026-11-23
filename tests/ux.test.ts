import {describe,it,expect} from 'vitest'
import {normalizeWorkspaceState,moveWorkspaceTab} from '../packages/ux/shared/workspace'
import {validateNovaFiles} from '../packages/ux/shared/files'

describe('workspace persistence invariants',()=>{
 const ids=['home','draft','review','report']
 it('never restores unknown IDs, duplicate tabs, or a closed active tab',()=>{
  const state=normalizeWorkspaceState({opened:['draft','unknown','draft','home','review'],pinned:['unknown','review','report'],active:'unknown'},ids,'home')
  expect(state.opened).toEqual(['home','review','draft']);expect(state.pinned).toEqual(['review']);expect(state.active).toBe('home')
 })
 it('always includes the home, including malformed or stale saved values',()=>{
  for(const saved of[null,{},42,'invalid',{opened:'bad',pinned:[5],active:'draft'}])expect(normalizeWorkspaceState(saved,ids,'home')).toEqual({opened:['home'],pinned:[],active:'home'})
 })
 it('does not move a tab across home or pinned boundaries',()=>{
  const state={opened:['home','draft','review','report'],pinned:['draft'],active:'review'}
  expect(moveWorkspaceTab(state,'draft',-1,'home')).toEqual(state)
  expect(moveWorkspaceTab(state,'review',-1,'home')).toEqual(state)
  expect(moveWorkspaceTab(state,'home',1,'home')).toEqual(state)
  expect(moveWorkspaceTab(state,'review',1,'home').opened).toEqual(['home','draft','report','review'])
 })
 it('retains active selection and pin membership during valid reorder',()=>{
  const state={opened:['home','draft','review','report'],pinned:[],active:'review'}
  const result=moveWorkspaceTab(state,'review',1,'home')
  expect(result.active).toBe('review');expect(result.pinned).toEqual([]);expect(state.opened).toEqual(['home','draft','review','report'])
 })
 it('drops no-longer-available screen IDs when a consuming service changes its catalog',()=>{
  expect(normalizeWorkspaceState({opened:ids,pinned:['report'],active:'report'},['home','draft'],'home')).toEqual({opened:['home','draft'],pinned:[],active:'home'})
 })
})

describe('client file selection policy',()=>{
 const policy={maxBytes:100,maxFiles:2,accept:'.txt,.csv'}
 it('accepts extension matching case-insensitively, and respects the exact size boundary',()=>{
  expect(validateNovaFiles([{name:'REPORT.CSV',type:'text/csv',size:100}],policy)).toBeNull()
 })
 it('rejects excessive file count, size and unsupported type',()=>{
  expect(validateNovaFiles(Array(3).fill({name:'file.txt',type:'text/plain',size:1}),policy)).toContain('최대 2개')
  expect(validateNovaFiles([{name:'file.txt',type:'text/plain',size:101}],policy)).toContain('크기 제한')
  expect(validateNovaFiles([{name:'file.exe',type:'application/octet-stream',size:1}],policy)).toContain('허용되지 않은')
 })
 it('handles exact and wildcard MIME policies without accepting unrelated types',()=>{
  expect(validateNovaFiles([{name:'photo.png',type:'image/png',size:1}],{...policy,accept:'image/*'})).toBeNull()
  expect(validateNovaFiles([{name:'file.txt',type:'text/plain',size:1}],{...policy,accept:'image/*'})).toContain('허용되지 않은')
  expect(validateNovaFiles([{name:'file.bin',type:'application/pdf',size:1}],{...policy,accept:'application/pdf'})).toBeNull()
 })
 it('allows clearing a selection',()=>expect(validateNovaFiles([],policy)).toBeNull())
})
