import { ProfileData, UserProfile } from '../models/profile-response';

export const toUserProfile = ({ member, isTrusted }: ProfileData): UserProfile => ({
  id: member.id,
  username: member.username,
  email: member.email,
  firstName: member.m_name,
  lastName: member.m_lastname,
  fullName: `${member.m_name} ${member.m_lastname}`.trim(),
  phone: `${member.m_phone}`,
  country: member.m_country,
  imageUrl: member.m_image_url,
  isKYC: member.isKYC === 1,
  isTrusted,
  createdAt: new Date(member.createdAt),
});
