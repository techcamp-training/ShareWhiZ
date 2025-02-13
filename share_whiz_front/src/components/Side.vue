<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import FormModal from './FormModal.vue'


const router = useRouter()
const showModal = ref(false);

// ユーザーの認証状態を監視
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if(user) {
      currentUser.value = computed(() =>  auth.currentUser)
    } else {
      currentUser.value = null
    }
  })
})

// ログアウト処理
const handleSignOut = async () => {
  try {
    await signOut(auth)
    router.push('/')
  } catch (error) {
    console.error('ログアウトに失敗しました', error)
  }
}

const closeModal = () => {
  showModal.value = false
}
</script>

<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <router-link to="/dashboard" class="sidebar-logo">
        <div class="avatar"></div>
        <span>ShareWhiZ</span>
      </router-link>
    </div>

    <div>
      <button
        class="new-memo-button"
        @click="showModal = true"
      >
      新しいメモを作成
      <span class="ellipsis">...</span>
      </button>
      <FormModal v-model="showModal" body="newPost" @close-modal="closeModal" />
    </div>

    <!-- ユーザー情報セクション -->
    <div class="user-section">
      <div class="user-info">
        <span
          class="user-name"
        >
          テストさん
        </span>
        <button
          variant="secondary"
          @click="handleSignOut"
          class="action-button logout-button"
          aria-label="ログアウトする"
        >
          ログアウト
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-section {
  margin-top: auto;
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.user-name {
  color: #fff;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  border-radius: 4px;
}

.action-button {
  width: 100%;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-button {
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.logout-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>