<script setup lang="ts">
import {z} from 'zod'
import type {TreeItem} from '@nuxt/ui'
const props=defineProps<{componentId:string;disabled:boolean}>()
const status=ref(''),busy=ref(false),message=ref(''),choice=ref<string|string[]>(''),priority=ref('normal'),checked=ref<boolean|'indeterminate'>(false),enabled=ref(true)
const date=ref<string|{start?:string;end?:string}>(),period=ref<string|{start?:string;end?:string}>()
const files=ref<File[]>([]),uploadMode=ref('single')
const modeOptions=[{label:'단일',value:'single'},{label:'다중',value:'multiple'},{label:'드롭존',value:'drop'},{label:'이미지',value:'image'}]
const options=[{label:'개발팀',value:'development'},{label:'디자인팀',value:'design'},{label:'운영팀',value:'operations'},{label:'비활성 항목',value:'disabled',disabled:true}]
const many=ref<string|string[]>([])
const form=reactive({name:'',email:''})
const schema=z.object({name:z.string().trim().min(2,'이름은 두 글자 이상 입력하세요.'),email:z.email('올바른 이메일을 입력하세요.')})
const alertOpen=ref(true),alertColor=ref<'info'|'success'|'warning'|'error'>('info'),modalOpen=ref(false),modalSize=ref<'sm'|'md'|'lg'>('md')
const progress=ref<number|null>(40),indeterminate=ref(false),contentTab=ref<string|number>('overview')
const accordion=ref<string|string[]>(['first']),treeSelected=shallowRef<TreeItem[]>([]),workspaceActive=ref('home')
const treeItems=[{id:'nova',label:'NOVA 프로젝트',defaultExpanded:true,children:[{id:'frontend',label:'프런트엔드',children:[{id:'ui',label:'UI 컴포넌트'},{id:'demo',label:'데모 화면'}]},{id:'backend',label:'백엔드',children:[{id:'auth',label:'인증'},{id:'gateway',label:'Gateway'}]}]}]
const workspaceItems=[{id:'home',label:'홈'},{id:'draft',label:'작성 중'},{id:'review',label:'검토'},{id:'report',label:'리포트'}]
const actionItems=computed(()=>[{label:'임시 저장',onSelect:()=>{status.value='임시 저장 동작을 선택했습니다. 서버에는 저장하지 않습니다.'}},{label:'새 문서',onSelect:()=>{status.value='새 문서 작업을 선택했습니다.'}},{label:'사용 불가',disabled:true}])
const navigationItems=[{label:'현황',to:'#navigation-overview'},{label:'업무',children:[{label:'내 업무',to:'#navigation-tasks'},{label:'팀 업무',to:'#navigation-team'}]}]
const tabs=[{label:'개요',value:'overview',content:'개요 콘텐츠입니다.'},{label:'상세',value:'detail',content:'상세 콘텐츠입니다.'},{label:'비활성',value:'disabled',disabled:true}]
const accordionItems=[{label:'데이터는 저장되나요?',value:'first',content:'이 화면의 값은 데모 상태입니다. 외부 서버에 전송하지 않습니다.'},{label:'키보드로 사용할 수 있나요?',value:'second',content:'Tab과 방향키로 탐색하고 Enter 또는 Space로 조작할 수 있습니다.'}]
const output=computed(()=>{
  switch(props.componentId){
    case 'input':return JSON.stringify(form)
    case 'textarea':return `${message.value.length}/200자`
    case 'select':return `단일: ${JSON.stringify(choice.value)} / 다중: ${JSON.stringify(many.value)}`
    case 'radio':return `선택: ${priority.value}`
    case 'checkbox':return `선택 상태: ${checked.value}`
    case 'switch':return enabled.value?'알림 켜짐':'알림 꺼짐'
    case 'date':return `날짜: ${JSON.stringify(date.value??null)} / 기간: ${JSON.stringify(period.value??null)}`
    case 'upload':return files.value.length?files.value.map(file=>`${file.name} (${file.size} bytes)`).join(', '):'선택된 파일이 없습니다. 서버 업로드는 하지 않습니다.'
    case 'tabs':return `활성 탭: ${contentTab.value}`
    case 'tree':return `선택: ${treeSelected.value.map(item=>item.label).join(', ')||'없음'}`
    case 'accordion':return `열린 항목: ${JSON.stringify(accordion.value)}`
    case 'workspace':return `활성 화면: ${workspaceActive.value}. 새로고침하면 열린 탭과 고정·순서를 복원합니다. 입력값 자체는 저장하지 않습니다.`
    default:return status.value||'컨트롤을 조작해 동작을 확인하세요.'
  }
})
function reset(){status.value='';message.value='';choice.value='';many.value=[];priority.value='normal';checked.value=false;enabled.value=true;date.value=undefined;period.value=undefined;files.value=[];uploadMode.value='single';form.name='';form.email='';alertOpen.value=true;modalOpen.value=false;progress.value=40;indeterminate.value=false;treeSelected.value=[];contentTab.value='overview';accordion.value=['first']}
watch(()=>props.componentId,reset)
watch(uploadMode,()=>{files.value=[]})
watch(indeterminate,value=>{progress.value=value?null:40})
defineExpose({reset})
</script>

<template>
  <div class="ux-example">
    <div v-if="componentId==='button'" class="ux-stack">
      <div class="ux-inline"><NovaButton label="기본 버튼" :disabled="disabled" @click="status='기본 동작을 실행했습니다.'" /><NovaButton label="아웃라인" variant="outline" :disabled="disabled" @click="status='아웃라인 동작입니다.'" /><NovaButton label="부드러운 버튼" variant="soft" :disabled="disabled" @click="status='소프트 동작입니다.'" /><NovaButton label="로딩 상태" :loading="busy" :disabled="disabled" @click="busy=!busy;status=busy?'로딩 표시를 켰습니다. 아래 해제 버튼을 누르세요.':'로딩을 해제했습니다.'" /></div>
      <NovaButton v-if="busy" label="로딩 해제" variant="ghost" @click="busy=false" />
      <form class="ux-inline" @submit.prevent="status='제출 이벤트를 확인했습니다. 서버 전송은 하지 않습니다.'" @reset="status='초기화 이벤트를 확인했습니다.'"><NovaButton label="제출" type="submit" variant="outline" :disabled="disabled" /><NovaButton label="초기화" type="reset" variant="ghost" :disabled="disabled" /><NovaButton label="상세 위치로 이동" to="#button-target" variant="ghost" :disabled="disabled" /></form><div id="button-target" tabindex="-1">링크 동작의 도착 위치입니다.</div>
    </div>
    <UForm v-else-if="componentId==='input'" :state="form" :schema="schema" :validate-on="[]" novalidate class="ux-form" @submit="status='검증을 통과했습니다. 입력은 서버에 저장하지 않습니다.'">
      <NovaFormField label="이름" name="name" required><NovaInput v-model="form.name" :disabled="disabled" placeholder="두 글자 이상" /></NovaFormField>
      <NovaFormField label="이메일" name="email" required><NovaInput v-model="form.email" type="email" :disabled="disabled" placeholder="name@example.com" /></NovaFormField>
      <NovaButton label="입력 검증" type="submit" :disabled="disabled" /><p v-if="status" role="status">{{status}}</p>
    </UForm>
    <NovaFormField v-else-if="componentId==='textarea'" label="업무 메모" help="최대 200자"><NovaTextarea v-model="message" :disabled="disabled" :maxlength="200" placeholder="여러 줄로 입력하세요" /></NovaFormField>
    <div v-else-if="componentId==='select'" class="ux-form"><NovaFormField label="담당 부서"><NovaSelect v-model="choice" :items="options" :disabled="disabled" placeholder="부서 선택" /></NovaFormField><NovaFormField label="참여 부서"><NovaSelect v-model="many" :items="options" multiple :disabled="disabled" placeholder="여러 부서 선택" /></NovaFormField></div>
    <NovaRadioGroup v-else-if="componentId==='radio'" v-model="priority" legend="업무 우선순위" :disabled="disabled" :items="[{label:'보통',value:'normal'},{label:'높음',value:'high'},{label:'선택 불가',value:'blocked',disabled:true}]" />
    <div v-else-if="componentId==='checkbox'" class="ux-stack"><NovaCheckbox v-model="checked" label="안내를 확인했습니다" :disabled="disabled" /><NovaButton label="부분 선택 상태" variant="outline" :disabled="disabled" @click="checked='indeterminate'" /></div>
    <NovaSwitch v-else-if="componentId==='switch'" v-model="enabled" label="업무 알림" description="업무 상태 변경 알림을 받습니다." :disabled="disabled" />
    <div v-else-if="componentId==='date'" class="ux-calendar-grid"><div><h4>단일 날짜</h4><NovaDatePicker v-model="date" reference-date="2026-11-14" min="2026-11-01" max="2026-12-31" :disabled="disabled" /></div><div><h4>기간</h4><NovaDatePicker v-model="period" range reference-date="2026-11-14" min="2026-11-01" max="2026-12-31" :disabled="disabled" /></div></div>
    <div v-else-if="componentId==='upload'" class="ux-stack"><NovaRadioGroup v-model="uploadMode" legend="파일 선택 방식" :items="modeOptions" orientation="horizontal" /><NovaFileUpload :key="uploadMode" v-model="files" :multiple="uploadMode==='multiple'||uploadMode==='drop'" :dropzone="uploadMode==='drop'||uploadMode==='image'" :accept="uploadMode==='image'?'image/*':'.txt,.csv'" :max-bytes="5242880" :disabled="disabled" /><p>텍스트·CSV 또는 이미지 예시입니다. 검증은 브라우저에서만 수행합니다.</p></div>
    <div v-else-if="componentId==='dropdown'" class="ux-inline"><NovaDropdown :items="actionItems" :disabled="disabled" /><NovaDropdown label="저장" :items="actionItems" split :disabled="disabled" @action="status='기본 저장 동작을 선택했습니다. 서버에는 저장하지 않습니다.'" /></div>
    <NovaTabs v-else-if="componentId==='tabs'" v-model="contentTab" :items="tabs"><template #default="{item}"><div class="ux-tab-content">{{item.content}}<NovaInput v-if="item.value==='detail'" aria-label="상세 탭 입력" placeholder="탭 콘텐츠 상태 유지 확인" /></div></template></NovaTabs>
    <div v-else-if="componentId==='menu'||componentId==='sidemenu'" class="ux-navigation-sample"><NovaMenu v-if="componentId==='menu'" :items="navigationItems" label="데모 상단 메뉴" /><NovaSideMenu v-else :items="navigationItems" label="데모 사이드 메뉴" /><section id="navigation-overview"><h4>현황</h4><p>현황 메뉴의 실제 이동 대상입니다.</p></section><section id="navigation-tasks"><h4>내 업무</h4><p>하위 메뉴에서 이 위치로 이동합니다.</p></section><section id="navigation-team"><h4>팀 업무</h4><p>팀 업무의 이동 대상입니다.</p></section></div>
    <NovaBreadcrumb v-else-if="componentId==='breadcrumb'" :items="[{label:'소개',to:'/'},{label:'NOVA UX',to:'/ux'},{label:'현재 위치'}]" />
    <NovaTree v-else-if="componentId==='tree'" v-model="treeSelected" :items="treeItems" :disabled="disabled" />
    <NovaAccordion v-else-if="componentId==='accordion'" v-model="accordion" :items="accordionItems" multiple :disabled="disabled" />
    <div v-else-if="componentId==='alert'" class="ux-stack"><div class="ux-inline"><NovaButton v-for="color in (['info','success','warning','error'] as const)" :key="color" :label="color" variant="outline" @click="alertColor=color;alertOpen=true" /></div><NovaAlert v-model:open="alertOpen" title="처리 상태 안내" description="알림 상태를 선택하고 닫기를 눌러보세요." :color="alertColor" dismissible /><NovaButton v-if="!alertOpen" label="알림 다시 표시" variant="ghost" @click="alertOpen=true" /></div>
    <div v-else-if="componentId==='modal'" class="ux-stack"><NovaRadioGroup v-model="modalSize" legend="대화상자 크기" :items="[{label:'작게',value:'sm'},{label:'기본',value:'md'},{label:'크게',value:'lg'}]" orientation="horizontal" /><NovaButton label="대화상자 열기" @click="modalOpen=true" /><NovaModal v-model:open="modalOpen" title="변경 내용 확인" description="이 대화상자는 키보드 포커스를 보호하며 Escape로 닫을 수 있습니다." :size="modalSize"><NovaFormField label="변경 메모"><NovaInput placeholder="대화상자 안에서 입력하세요" /></NovaFormField><template #footer><NovaButton label="취소" variant="outline" @click="modalOpen=false" /><NovaButton label="확인" @click="modalOpen=false;status='대화상자 확인을 선택했습니다.'" /></template></NovaModal></div>
    <div v-else-if="componentId==='progress'" class="ux-stack"><NovaProgress v-model="progress" label="데모 작업 진행률" /><div class="ux-inline"><NovaButton label="20% 증가" variant="outline" :disabled="indeterminate" @click="progress=((progress??0)+20)%120" /><NovaSwitch v-model="indeterminate" label="불확정 진행" /></div><output>{{progress===null?'불확정 진행 중':`${progress}%`}}</output></div>
    <NovaTabWorkspace v-else-if="componentId==='workspace'" v-model="workspaceActive" :items="workspaceItems" :initial-ids="['home','draft']" storage-key="nova-ux-workspace-v1"><template #content="{item}"><UxWorkspacePane :key="item.id" :item="item" /></template></NovaTabWorkspace>
    <p class="ux-live-value" role="status">{{output}}</p>
  </div>
</template>
