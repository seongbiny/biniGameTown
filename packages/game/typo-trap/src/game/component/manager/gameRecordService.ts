import { supabase } from '../../utils/supabaseClient';

export const submitGameResult = async (stage: number) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log('사용자가 로그인되어 있지 않아 결과를 저장할 수 없습니다.');
      return;
    }

    const record = {
      user_id: user.id,
      game_name: 'typo-trap',
      score: stage,
    };

    const { error } = await supabase.from('scores').insert(record);

    if (error) {
      console.error('게임 결과 저장 실패:', error);
      throw error;
    }
  } catch (error) {
    console.error('게임 결과 전송 중 예외 발생:', error);
  }
};
